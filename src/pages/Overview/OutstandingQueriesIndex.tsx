import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import Can from "@/components/auth/Can";
import Label from "@/components/form/Label";
import Select from "@/components/form/Select";
import Combobox from "@/components/form/Combobox";
import Alert from "@/components/ui/alert/Alert";
import { Modal } from "@/components/ui/modal";
import CommentSection from "@/components/bordereau/CommentSection";
import {
    fetchOutstandingQueries,
    type OutstandingQueryRow,
} from "@/database/overview_api";
import { addBordereauComment } from "@/database/comment_api";
import {
    assignBordereauInProgress,
    changeBordereauOutcome,
    fetchBordereauById,
} from "@/database/bordereau_api";
import { fetchBpcOptions } from "@/database/bpc_api";
import { fetchOutcomeList } from "@/database/outcome_api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type { IOutcomeForm } from "@/types/OutcomeSchema";

export default function OutstandingQueriesIndex() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [searchParams] = useSearchParams();
    const departmentIdRaw = searchParams.get("department_id");
    const departmentIdNumber =
        departmentIdRaw && Number.isFinite(Number(departmentIdRaw))
            ? Number(departmentIdRaw)
            : undefined;
    const overviewLink = departmentIdNumber
        ? `/overview?department_id=${departmentIdNumber}`
        : "/overview";

    const { data, isLoading } = useQuery({
        queryKey: ["overview", "outstanding-queries", "snapshot", departmentIdNumber],
        queryFn: () => fetchOutstandingQueries(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assigningRow, setAssigningRow] = useState<OutstandingQueryRow | null>(null);
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

    const resolveCommentTextareaRef = useRef<HTMLTextAreaElement | null>(null);

    const { data: bpcOptions } = useQuery({
        queryKey: ["bpc-options"],
        queryFn: () => fetchBpcOptions(),
        staleTime: 1000 * 30,
    });

    const { data: outcomeList } = useQuery({
        queryKey: ["outcome-list"],
        queryFn: () => fetchOutcomeList(),
        staleTime: 1000 * 60 * 5,
    });

    const { data: commentBordereauDetail } = useQuery({
        queryKey: ["bordereau", "by-id", commentBordereauId],
        queryFn: () => fetchBordereauById(commentBordereauId as number),
        enabled: commentModalOpen && commentBordereauId !== null,
        staleTime: 0,
    });

    const { data: resolveBordereauDetail } = useQuery({
        queryKey: ["bordereau", "by-id", resolveBordereauId],
        queryFn: () => fetchBordereauById(resolveBordereauId as number),
        enabled: resolveModalOpen && resolveBordereauId !== null,
        staleTime: 0,
    });

    const outcomeOptions = useMemo(() => {
        type FlatOutcome = {
            value: string;
            label: string;
            id: number;
            heading: string;
            comment_mandatory?: boolean;
        };

        const flat = (outcomeList ?? [])
            .filter((o: IOutcomeForm) => typeof o.id === "number")
            .map((o: IOutcomeForm) => ({
                value: String(o.id),
                label: String(o.outcome_code ?? o.description ?? ""),
                id: Number(o.id),
                heading: String(o.outcome_code_heading ?? "Other"),
                comment_mandatory: Boolean(o.comment_mandatory),
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
                bordereau_status_id: statusIdNum as 3 | 6 | 7,
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
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to assign");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ["overview", "outstanding-queries"] });
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
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to add comment");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({ queryKey: ["overview", "outstanding-queries"] });
            await queryClient.invalidateQueries({ queryKey: ["bordereau", "by-id"] });
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
            await queryClient.invalidateQueries({ queryKey: ["overview", "outstanding-queries"] });
        },
    });

    const headlineValue = new Intl.NumberFormat().format(
        data?.query_activities_count ?? 0,
    );

    const rows = data?.rows ?? [];

    const columns = useMemo<ColumnDef<OutstandingQueryRow>[]>(
        () => [
            {
                accessorKey: "bordereau",
                header: "Bordereau Name",
                cell: ({ row }) => (
                    <div>{String(row.getValue("bordereau") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "supplier_name",
                header: "Supplier",
                cell: ({ row }) => (
                    <div>{String(row.getValue("supplier_name") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "claim_number",
                header: "Claim Number",
                cell: ({ row }) => (
                    <div>{String(row.getValue("claim_number") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "current_status",
                header: "Current Status",
                cell: ({ row }) => (
                    <div>{String(row.getValue("current_status") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "agent_name",
                header: "Agent",
                cell: ({ row }) => (
                    <div>{String(row.getValue("agent_name") ?? "-") || "-"}</div>
                ),
            },
            {
                accessorKey: "last_comment",
                header: "Last Comment",
                cell: ({ row }) => (
                    <div>{String(row.getValue("last_comment") ?? "-") || "-"}</div>
                ),
            },
            {
                accessorKey: "target_payment_date",
                header: "Ideal Process",
                cell: ({ row }) => (
                    <div>
                        {String(row.getValue("target_payment_date") ?? "-")}
                    </div>
                ),
            },
            {
                accessorKey: "deadline_payment_date",
                header: "Deadline",
                cell: ({ row }) => (
                    <div>
                        {String(row.getValue("deadline_payment_date") ?? "-")}
                    </div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-1">
                        <Can permission="bordereau_detail.view">
                            <Button
                                size="xs"
                                onClick={() =>
                                    navigate(`/bordereau-detail/view/${row.original.id}`)
                                }
                            >
                                View
                            </Button>
                        </Can>

                        <Can permission="modules.delete">
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

                        <Can permission="modules.delete">
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

                        <Can permission="modules.delete">
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
                ),
            },
        ],
        [assignMutation.isPending, navigate],
    );

    return (
        <>
            <PageBreadcrumb
                pageTitle="Outstanding Queries"
                pageBreadcrumbs={[{ title: "Overview", link: overviewLink }]}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics
                        label="Outstanding Queries"
                        value={headlineValue}
                    />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    List of Outstanding Queries
                                </h3>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto custom-scrollbar">
                            <div className="min-w-[1000px] xl:min-w-full px-2">
                                {!isLoading ? (
                                    <DataTable columns={columns} data={rows} />
                                ) : (
                                    <div className="flex items-center justify-center py-12">
                                        <Spinner size="lg" />
                                    </div>
                                )}
                            </div>
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
                        message={assigningRow?.agent_name ? assigningRow.agent_name : "No BPC Assigned"}
                        showLink={false}
                    />

                    <div className="mt-6">
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <Label htmlFor="outstanding-assign-status">Status</Label>
                                <Select
                                    options={[
                                        { value: "3", label: "Activity Queued" },
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
                                <Label htmlFor="outstanding-assign-bpc">BPC to Assign</Label>
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
                                <Label htmlFor="outstanding-assign-instructions">Instructions</Label>
                                <textarea
                                    id="outstanding-assign-instructions"
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
                                    comments={commentBordereauDetail?.comments ?? []}
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
                        <Label htmlFor="outstanding-resolve-outcome">Outcome</Label>
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
                                    comments={resolveBordereauDetail?.comments ?? []}
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
