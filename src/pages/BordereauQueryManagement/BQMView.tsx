import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useNavigate } from "react-router";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "@/icons";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import FilterFieldCard from "@/components/common/FilterFieldCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    changeBordereauOutcome,
    assignBordereauInProgress,
    fetchBordereauList,
} from "@/database/bordereau_api";
import { IBordereauComment, IBordereauIndex } from "@/types/BordereauSchema";
import { fetchBpcOptions } from "@/database/bpc_api";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon, User2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";
import Combobox from "@/components/form/Combobox";
import CommentSection from "@/components/bordereau/CommentSection";
import { addBordereauComment } from "@/database/comment_api";
import { useAuth } from "@/hooks/useAuth";
import { fetchOutcomeList } from "@/database/outcome_api";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export type BQMType = {
    id: number;
    supplier_name: string;
    bordereau: string;
    claim_number: string;
    status: string;
    assigned_to: string;
    target_process_by: string;
    latest_comment: string;
    comments?: IBordereauComment[];
};

export default function BQMView () {
    const navigate = useNavigate();
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const [selectedBpcId, setSelectedBpcId] = useState<string>("");

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assigningRow, setAssigningRow] = useState<BQMType | null>(null);
    const [assignModalBpcId, setAssignModalBpcId] = useState<number | string>("");
    const [assignModalStatusId, setAssignModalStatusId] = useState<string>("");
    const [assignModalInstructions, setAssignModalInstructions] = useState<string>("");

    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const [commentBordereauId, setCommentBordereauId] = useState<number | null>(null);
    const [newCommentText, setNewCommentText] = useState("");

    const [resolveModalOpen, setResolveModalOpen] = useState(false);
    const [resolveBordereauId, setResolveBordereauId] = useState<number | null>(null);
    const [resolveOutcomeValue, setResolveOutcomeValue] = useState<string>("");
    const [resolveCommentText, setResolveCommentText] = useState("");
    const [resolveSessionCommentsAdded, setResolveSessionCommentsAdded] = useState(false);
    const [activityView, setActivityView] = useState<string>("all");

    const resolveCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { data: bpcOptions } = useQuery({
        queryKey: ["bpc-options"],
        queryFn: () => fetchBpcOptions(),
        staleTime: 1000 * 30,
    });

    const { data: queryPayload } = useQuery({
        queryKey: ["bordereau-query-management"],
        queryFn: () =>
            fetchBordereauList({
                invoice_status: "query",
                include_in_progress: true,
                include_comments: true,
                per_page: 100,
                page: 1,
            }),
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 15,
    });

    const { data: outcomeList } = useQuery({
        queryKey: ["outcome-list"],
        queryFn: () => fetchOutcomeList(),
        staleTime: 1000 * 60 * 5,
    });

    const assignMutation = useMutation({
        mutationFn: async (params: {
            bordereauId: number;
            bpcId: number | string;
            statusId: number | string;
            instructions?: string;
        }) => {
            const bordereauIdNum = Number(params.bordereauId);
            const bpcIdNum = Number(params.bpcId);
            const statusIdNum = Number(params.statusId);

            if (!Number.isFinite(bordereauIdNum) || bordereauIdNum <= 0) {
                throw new Error("Invalid bordereau");
            }
            if (!Number.isFinite(bpcIdNum) || bpcIdNum <= 0) {
                throw new Error("Please select a BPC first");
            }
            if (![3, 6, 7].includes(statusIdNum)) {
                throw new Error("Please select a status first");
            }

            await assignBordereauInProgress({
                bordereau_id: bordereauIdNum,
                bpc_id: bpcIdNum,
                bordereau_status_id: statusIdNum as 6 | 7,
                instructions: params.instructions ?? null,
            });
        },
        onSuccess: () => {
            toast.success("Assigned");
            setAssignModalOpen(false);
            setAssigningRow(null);
            setAssignModalBpcId("");
            setAssignModalStatusId("");
            setAssignModalInstructions("");
            void queryClient.invalidateQueries({ queryKey: ["bordereau-query-management"] });
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to assign");
        },
    });

    const addCommentMutation = useMutation({
        mutationFn: async (params: { bordereauId: number; comment: string }) => {
            const bordereauIdNum = Number(params.bordereauId);
            if (!Number.isFinite(bordereauIdNum) || bordereauIdNum <= 0) {
                throw new Error("Invalid bordereau");
            }
            const comment = params.comment.trim();
            if (!comment) {
                throw new Error("Comment is required");
            }

            return await addBordereauComment(bordereauIdNum, comment);
        },
        onMutate: async ({ bordereauId, comment }) => {
            await queryClient.cancelQueries({
                queryKey: ["bordereau-query-management"],
            });

            const previous = queryClient.getQueryData([
                "bordereau-query-management",
            ]) as unknown;

            const optimisticComment: IBordereauComment = {
                id: -Date.now(),
                bordereau_id: bordereauId,
                comment,
                created_by: user ? `${user.firstname} ${user.lastname}` : "",
                created_at: new Date().toISOString(),
            };

            queryClient.setQueryData([
                "bordereau-query-management",
            ], (old: any) => {
                if (!old || !Array.isArray(old.data)) return old;
                return {
                    ...old,
                    data: old.data.map((b: any) => {
                        if (Number(b?.id) !== bordereauId) return b;
                        const comments = Array.isArray(b?.comments)
                            ? b.comments
                            : [];
                        return {
                            ...b,
                            comments: [...comments, optimisticComment],
                        };
                    }),
                };
            });

            return { previous };
        },
        onError: (err: unknown, _vars, ctx: any) => {
            if (ctx?.previous) {
                queryClient.setQueryData(
                    ["bordereau-query-management"],
                    ctx.previous,
                );
            }
            toast.error(err instanceof Error ? err.message : "Failed to add comment");
        },
        onSuccess: () => {
            toast.success("Comment added");
            if (commentModalOpen) {
                setNewCommentText("");
            }
            if (resolveModalOpen) {
                setResolveCommentText("");
                setResolveSessionCommentsAdded(true);
            }
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["bordereau-query-management"],
            });
        },
    });

    const resolveMutation = useMutation({
        mutationFn: async (params: { bordereauId: number; outcomeId: number }) => {
            const bordereauIdNum = Number(params.bordereauId);
            const outcomeIdNum = Number(params.outcomeId);
            if (!Number.isFinite(bordereauIdNum) || bordereauIdNum <= 0) {
                throw new Error("Invalid bordereau");
            }
            if (!Number.isFinite(outcomeIdNum) || outcomeIdNum <= 0) {
                throw new Error("Please select an outcome");
            }

            await changeBordereauOutcome(bordereauIdNum, outcomeIdNum);
        },
        onSuccess: () => {
            toast.success("Resolved");
            setResolveModalOpen(false);
            setResolveBordereauId(null);
            setResolveOutcomeValue("");
            setResolveCommentText("");
            setResolveSessionCommentsAdded(false);
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to resolve");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ["bordereau-query-management"] });
        },
    });

    const bpcSelectOptions = useMemo(() => {
        return [
            { value: "", label: "-Select Bordereau Processing Clerk-" },
            ...(bpcOptions ?? []).map((o) => ({ value: String(o.value), label: o.label })),
        ];
    }, [bpcOptions]);

    const queryRows: BQMType[] = (queryPayload?.data ?? []).map((b: IBordereauIndex) => {
        const supplierName = b.supplier?.name ?? "";
        const statusLabel = b.bordereau_status?.status ?? "";

        const contact = b.bpc?.contact;
        const assignedTo = contact
            ? `${contact.firstname ?? ""} ${contact.lastname ?? ""}`.trim()
            : "Unassigned";

        const comments = b.comments ?? [];
        const latestComment = comments.length > 0 ? (comments[comments.length - 1]?.comment ?? "") : "";

        return {
            id: b.id ?? 0,
            supplier_name: supplierName,
            bordereau: String(b.bordereau ?? ""),
            claim_number: String(b.claim_number ?? ""),
            status: String(statusLabel ?? ""),
            assigned_to: assignedTo,
            target_process_by: String(b.target_payment_date ?? ""),
            latest_comment: String(latestComment ?? ""),
            comments,
        };
    });

    const visibleQueryRows = useMemo(() => {
        if (activityView === "all") {
            return queryRows;
        }

        const wipStatuses = new Set(["Activity in Progress with BPC"]);
        const queryWaitingStatuses = new Set([
            "Activity Queued Sensitive",
            "Activity Queued Staff",
            "Activity Queued Fraud",
        ]);
        const queryNeedsActionStatuses = new Set([
            "Query Redirect",
            "Activity in Progress with Supplier",
        ]);

        return queryRows.filter((row) => {
            if (activityView === "wip") {
                return wipStatuses.has(row.status);
            }

            if (activityView === "query-waiting") {
                return queryWaitingStatuses.has(row.status);
            }

            if (activityView === "query-needs-action") {
                return queryNeedsActionStatuses.has(row.status);
            }

            return true;
        });
    }, [activityView, queryRows]);

    const activeCommentRow = commentBordereauId
        ? queryRows.find((r) => r.id === commentBordereauId) ?? null
        : null;

    const activeResolveRow = resolveBordereauId
        ? queryRows.find((r) => r.id === resolveBordereauId) ?? null
        : null;

    const outcomeOptions = useMemo(() => {
        type FlatOutcome = {
            value: string;
            label: string;
            id: number;
            heading: string;
            comment_mandatory?: boolean;
        };

        const raw = (outcomeList ?? []) as unknown as Array<Record<string, unknown>>;
        const flat = raw
            .filter((o) => typeof o.id === "number")
            .map((o) => ({
                value: String(o.id),
                label: String((o as any).outcome_code ?? (o as any).description ?? ""),
                id: Number(o.id),
                heading: String((o as any).outcome_code_heading ?? "Other"),
                comment_mandatory: Boolean((o as any).comment_mandatory),
            })) as FlatOutcome[];

        const groups: Record<string, { value: string; label: string }[]> = {};
        flat.forEach((f) => {
            const heading = f.heading || "Other";
            if (!groups[heading]) groups[heading] = [];
            groups[heading].push({ value: f.value, label: f.label });
        });

        const grouped = Object.keys(groups).map((k) => ({
            label: k,
            options: groups[k],
        }));

        return {
            flat,
            grouped,
        };
    }, [outcomeList]);
   
    const columns: ColumnDef<BQMType>[] = [
        { accessorKey: "supplier_name", header: "Supplier Name" },
        { accessorKey: "bordereau", header: "Bordereau" },
        { accessorKey: "claim_number", header: "Claim Number" },
        {
            accessorKey: "assigned_to",
            header: "Agent",
            cell: ({ row }) => {
                const label = String(row.getValue("assigned_to") ?? "Unassigned");
                const isUnassigned = label.toLowerCase() === "unassigned";

                return (
                    <Badge variant={isUnassigned ? "outline" : "secondary"}>
                        <User2 className="mr-1 inline-block" />
                        {label}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    <BadgeCheckIcon className="mr-1 inline-block" />
                    {String(row.getValue("status") ?? "")}
                </Badge>
            ),
        },
        { accessorKey: "target_process_by", header: "Target Process by" },
        { accessorKey: "latest_comment", header: "Latest Comment" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                return (
                    <div className="flex items-center gap-1">
                        <Can permission="bordereau_query_management.view">
                            <Button
                                size="xs"
                                onClick={() =>
                                    navigate(`/bordereau-detail/view/${row.original.id}`)
                                }
                            >
                                View
                            </Button>
                        </Can>

                        <Can permission="bordereau_query_management.delete">
                            <Button
                                size="xs"
                                variant="warning"
                                onClick={() => {
                                    setCommentBordereauId(row.original.id);
                                    setNewCommentText("");
                                    setCommentModalOpen(true);
                                }}
                            >
                                Add Note
                            </Button>
                        </Can>

                        <Can permission="bordereau_query_management.delete">
                            <Button
                                size="xs"
                                variant="success"
                                onClick={() => {
                                    setResolveBordereauId(row.original.id);
                                    setResolveOutcomeValue("");
                                    setResolveCommentText("");
                                    setResolveSessionCommentsAdded(false);
                                    setResolveModalOpen(true);
                                }}
                            >
                                Resolve
                            </Button>
                        </Can>

                        <Can permission="bordereau_query_management.delete">
                            <Button
                                size="xs"
                                variant="outline"
                                onClick={() => {
                                    setAssigningRow(row.original);
                                    setAssignModalBpcId("");
                                    setAssignModalStatusId("");
                                    setAssignModalInstructions("");
                                    setAssignModalOpen(true);
                                }}
                                disabled={assignMutation.isPending}
                            >
                                Assign
                            </Button>
                        </Can>

                    </div>
                );
            },
        },
    ];


    return (
        <>
            <PageBreadcrumb pageTitle="Activity Query Management" />
            <div className="w-full">
                
                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        <div className="col-span-12 space-y-6 xl:col-span-9">
                            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6 mb-5">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                    Filter
                                </h3>
                                <div className="grid grid-cols-12 gap-4 md:gap-6">
                                    <div className="col-span-12 space-y-6 xl:col-span-6">
                                        <div>
                                            <Label htmlFor="filter-status">
                                                Assigned To
                                            </Label>
                                            <Select
                                                options={bpcSelectOptions}
                                                value={selectedBpcId}
                                                onChange={setSelectedBpcId}
                                                placeholder="-Select Bordereau Processing Clerk-"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12 space-y-6 xl:col-span-6">
                                        <div>
                                            <Label htmlFor="filter-status">
                                                Supplier
                                            </Label>
                                            <Select
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-Select Supplier-",
                                                    },
                                                    {
                                                        value: "in_progress",
                                                        label: "In Progress",
                                                    },
                                                    {
                                                        value: "queued",
                                                        label: "Queued",
                                                    },
                                                    { value: "query", label: "Query" },
                                                    {
                                                        value: "closed",
                                                        label: "Closed (Paid)",
                                                    },
                                                ]}
                                                value={""}
                                                onChange={() => {}}
                                                placeholder="-Select Supplier-"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <h5 className="font-700 pt-5 pb-2">
                                    Upload:
                                </h5>
                                <div className="grid grid-cols-12 gap-4 md:gap-6">
                                    <div className="col-span-12 space-y-6 xl:col-span-6">
                                         <div>
                                            <Label>Date From</Label>
                                            <DatePicker
                                                id="filter-date-from"
                                                placement="top"
                                                placeholder="Date from"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-12 space-y-6 xl:col-span-6">
                                        <div>
                                            <Label>Date To</Label>
                                            <DatePicker
                                                id="filter-date-to"
                                                placement="top"
                                                placeholder="Date to"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 flex gap-3 justify-end">
                                    <Button size="sm">Filter</Button>
                                    <Button size="sm" variant="outline">
                                        Reset
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 space-y-6 xl:col-span-3">
                            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6 mb-5">
                                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                    <PencilIcon className="text-gray-800 size-6 dark:text-white/90" />
                                </div>

                                <div className="flex items-end justify-between mt-5">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Outstanding Queries
                                        </span>
                                        <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                                            {visibleQueryRows.length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Activity Query Management
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all Bordereau with Queries and their
                                details.
                            </p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <FilterFieldCard
                            label="Activity View"
                            description="Switch between all activities and the query subsets shown in the table."
                            className="w-full"
                        >
                            <RadioGroup
                                value={activityView}
                                onValueChange={setActivityView}
                                className="flex flex-wrap items-center gap-3"
                            >
                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                    <RadioGroupItem value="all" id="activity-view-all" />
                                    <Label htmlFor="activity-view-all" className="mb-0">
                                        All
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                    <RadioGroupItem value="wip" id="activity-view-wip" />
                                    <Label htmlFor="activity-view-wip" className="mb-0">
                                        WIP
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                    <RadioGroupItem value="query-waiting" id="activity-view-query-waiting" />
                                    <Label htmlFor="activity-view-query-waiting" className="mb-0">
                                        Query (Waiting for BPC)
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                    <RadioGroupItem value="query-needs-action" id="activity-view-query-needs-action" />
                                    <Label htmlFor="activity-view-query-needs-action" className="mb-0">
                                        Query (Needs Action)
                                    </Label>
                                </div>
                            </RadioGroup>
                        </FilterFieldCard>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">

                            <DataTable columns={columns} data={visibleQueryRows} />
                            {/* {!isLoading && documents ? (
                                <DataTable columns={columns} data={documents} />
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )} */}
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={assignModalOpen}
                onClose={() => {
                    setAssignModalOpen(false);
                    setAssigningRow(null);
                    setAssignModalBpcId("");
                    setAssignModalStatusId("");
                    setAssignModalInstructions("");
                }}
                className="max-w-3xl mx-4"
            >
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold mb-5">Assign</h3>

                    <Alert
                        variant="info"
                        title="Current BPC"
                        message={assigningRow?.assigned_to ? assigningRow.assigned_to : "No BPC Assigned"}
                        showLink={false}
                    />

                    <div className="mt-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="bqm-assign-status">Status</Label>
                                <Select
                                    options={[
                                        {
                                            value: "3",
                                            label: "Activity Queued",
                                        },
                                        {
                                            value: "6",
                                            label: "Activity in Progress Query with Supplier",
                                        },
                                        {
                                            value: "7",
                                            label: "Activity in Progress with BPC",
                                        },
                                    ]}
                                    value={assignModalStatusId}
                                    onChange={setAssignModalStatusId}
                                    placeholder="Select Status"
                                />
                            </div>

                            <div>
                                <Label htmlFor="bqm-assign-bpc">BPC to Assign</Label>
                                <Combobox
                                    value={assignModalBpcId}
                                    options={bpcOptions ?? []}
                                    onChange={(value) => setAssignModalBpcId(value)}
                                    placeholder="Select BPC..."
                                    searchPlaceholder="Search BPC..."
                                    emptyText="No BPC found."
                                />
                            </div>

                            <div>
                                <Label htmlFor="bqm-assign-instructions">Instructions</Label>
                                <textarea
                                    id="bqm-assign-instructions"
                                    value={assignModalInstructions}
                                    onChange={(e) => setAssignModalInstructions(e.target.value)}
                                    rows={6}
                                    className="mt-1 w-full rounded-md border border-gray-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700"
                                    placeholder="Write Instructions for BPC Here"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="danger"
                            onClick={() => {
                                setAssignModalOpen(false);
                                setAssigningRow(null);
                                setAssignModalBpcId("");
                                setAssignModalStatusId("");
                                setAssignModalInstructions("");
                            }}
                            disabled={assignMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                if (!assigningRow?.id) {
                                    toast.error("Please select a bordereau first");
                                    return;
                                }
                                assignMutation.mutate({
                                    bordereauId: assigningRow.id,
                                    bpcId: assignModalBpcId,
                                    statusId: assignModalStatusId,
                                    instructions: assignModalInstructions,
                                });
                            }}
                            disabled={assignMutation.isPending}
                        >
                            {assignMutation.isPending ? "Assigning..." : "Assign"}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={commentModalOpen}
                onClose={() => {
                    setCommentModalOpen(false);
                    setCommentBordereauId(null);
                    setNewCommentText("");
                }}
                className="max-w-3xl mx-4"
            >
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold mb-5">Add Comment</h3>

                    <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                        <textarea
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            placeholder="Add a comment"
                            className="w-full rounded-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                            rows={3}
                        />
                        <div className="mt-2 flex items-center justify-end">
                            <button
                                onClick={() => {
                                    if (!commentBordereauId) return;
                                    const trimmed = newCommentText.trim();
                                    if (!trimmed) return;
                                    addCommentMutation.mutate({
                                        bordereauId: commentBordereauId,
                                        comment: trimmed,
                                    });
                                }}
                                disabled={
                                    addCommentMutation.isPending ||
                                    !newCommentText.trim()
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 disabled:opacity-60"
                            >
                                {addCommentMutation.isPending
                                    ? "Adding..."
                                    : "Add Comment"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Bordereau Comments
                        </h4>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                            <div>
                                <CommentSection
                                    comments={activeCommentRow?.comments ?? []}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={resolveModalOpen}
                onClose={() => {
                    setResolveModalOpen(false);
                    setResolveBordereauId(null);
                    setResolveOutcomeValue("");
                    setResolveCommentText("");
                    setResolveSessionCommentsAdded(false);
                }}
                className="max-w-3xl mx-4"
            >
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold mb-5">Resolve</h3>

                    <div className="mb-6">
                        <Label htmlFor="bqm-resolve-outcome">Outcome</Label>
                        <Select
                            options={outcomeOptions.grouped}
                            placeholder="Select outcome"
                            value={resolveOutcomeValue}
                            onChange={setResolveOutcomeValue}
                            className="bg-white dark:bg-gray-800"
                        />
                    </div>

                    <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                        <textarea
                            ref={(el) => {
                                resolveCommentTextareaRef.current = el;
                            }}
                            value={resolveCommentText}
                            onChange={(e) => setResolveCommentText(e.target.value)}
                            placeholder="Add a comment"
                            className="w-full rounded-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                            rows={3}
                        />
                        <div className="mt-2 flex items-center justify-end">
                            <button
                                onClick={() => {
                                    if (!resolveBordereauId) return;
                                    const trimmed = resolveCommentText.trim();
                                    if (!trimmed) return;
                                    addCommentMutation.mutate({
                                        bordereauId: resolveBordereauId,
                                        comment: trimmed,
                                    });
                                }}
                                disabled={
                                    addCommentMutation.isPending ||
                                    !resolveCommentText.trim()
                                }
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 disabled:opacity-60"
                            >
                                {addCommentMutation.isPending
                                    ? "Adding..."
                                    : "Add Comment"}
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                        <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                            Bordereau Comments
                        </h4>
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                            <div>
                                <CommentSection
                                    comments={activeResolveRow?.comments ?? []}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="danger"
                            onClick={() => {
                                setResolveModalOpen(false);
                                setResolveBordereauId(null);
                                setResolveOutcomeValue("");
                                setResolveCommentText("");
                                setResolveSessionCommentsAdded(false);
                            }}
                            disabled={resolveMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => {
                                if (!resolveBordereauId) return;

                                const outcomeId = Number(resolveOutcomeValue);
                                const selected = outcomeOptions.flat.find(
                                    (o) => o.id === outcomeId,
                                );
                                const needsComment = Boolean(
                                    selected?.comment_mandatory,
                                );

                                if (needsComment && !resolveSessionCommentsAdded) {
                                    toast.error(
                                        "This outcome requires a comment. Please add a comment first.",
                                    );
                                    resolveCommentTextareaRef.current?.focus();
                                    return;
                                }

                                resolveMutation.mutate({
                                    bordereauId: resolveBordereauId,
                                    outcomeId,
                                });
                            }}
                            disabled={
                                resolveMutation.isPending ||
                                !resolveOutcomeValue
                            }
                        >
                            {resolveMutation.isPending
                                ? "Resolving..."
                                : "Resolve"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}