import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { useNavigate } from "react-router";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import { PencilIcon } from "@/icons";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBordereauList } from "@/database/bordereau_api";
import { IBordereauIndex } from "@/types/BordereauSchema";
import { fetchBpcOptions } from "@/database/bpc_api";
import { queueBordereauForBpc } from "@/database/bordereau_api";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Alert from "@/components/ui/alert/Alert";
import Combobox from "@/components/form/Combobox";

export type BQMType = {
    id: number;
    supplier_name: string;
    bordereau: string;
    claim_number: string;
    name: string;
    status: string;
    assigned_to: string;
    target_process_by: string;
    latest_comment: string;
};

export default function BQMView () {
    // const navigate = useNavigate();

    const queryClient = useQueryClient();

    const [selectedBpcId, setSelectedBpcId] = useState<string>("");

    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [assigningRow, setAssigningRow] = useState<BQMType | null>(null);
    const [assignModalBpcId, setAssignModalBpcId] = useState<number | string>("");

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
                per_page: 100,
                page: 1,
            }),
        staleTime: 1000 * 15,
        refetchInterval: 1000 * 15,
    });

    const assignMutation = useMutation({
        mutationFn: async (params: { bordereauId: number; bpcId: number | string }) => {
            const bordereauIdNum = Number(params.bordereauId);
            const bpcIdNum = Number(params.bpcId);

            if (!Number.isFinite(bordereauIdNum) || bordereauIdNum <= 0) {
                throw new Error("Invalid bordereau");
            }
            if (!Number.isFinite(bpcIdNum) || bpcIdNum <= 0) {
                throw new Error("Please select a BPC first");
            }

            await queueBordereauForBpc({
                bordereau_id: bordereauIdNum,
                bpc_id: bpcIdNum,
            });
        },
        onSuccess: () => {
            toast.success("Assigned and queued");
            setAssignModalOpen(false);
            setAssigningRow(null);
            setAssignModalBpcId("");
            void queryClient.invalidateQueries({ queryKey: ["bordereau-query-management"] });
        },
        onError: (err) => {
            toast.error(err instanceof Error ? err.message : "Failed to assign");
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
            : "";

        const comments = b.comments ?? [];
        const latestComment = comments.length > 0 ? (comments[comments.length - 1]?.comment ?? "") : "";

        return {
            id: b.id ?? 0,
            supplier_name: supplierName,
            bordereau: String(b.bordereau ?? ""),
            claim_number: String(b.claim_number ?? ""),
            name: String(b.name ?? ""),
            status: String(statusLabel ?? ""),
            assigned_to: assignedTo,
            target_process_by: String(b.target_payment_date ?? ""),
            latest_comment: String(latestComment ?? ""),
        };
    });
   
    const columns: ColumnDef<BQMType>[] = [
        { accessorKey: "supplier_name", header: "Supplier Name" },
        { accessorKey: "bordereau", header: "Bordereau" },
        { accessorKey: "claim_number", header: "Claim Number" },
        { accessorKey: "name", header: "Name" },
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
                    <div className="flex items-center gap-2">
                        <Can permission="modules.edit">
                            <Button
                                size="sm"
                                // onClick={() =>
                                //     navigate(`/document-management/edit/${item.id}`)
                                // }
                            >
                                View
                            </Button>
                        </Can>

                        <Can permission="modules.delete">
                            <Button
                                size="sm"
                                variant="warning"
                                // onClick={() => handleDeleteClick(item.id!)}
                            >
                                Add Note
                            </Button>
                        </Can>

                        <Can permission="modules.delete">
                            <Button
                                size="sm"
                                variant="success"
                                // onClick={() => handleDeleteClick(item.id!)}
                            >
                                Resolve
                            </Button>
                        </Can>

                        <Can permission="modules.delete">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setAssigningRow(row.original);
                                    setAssignModalBpcId("");
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
            <PageBreadcrumb pageTitle="Bordereau Query Management" />
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
                                            {queryPayload?.total ?? queryRows.length}
                                        </h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Bordereau Query Management
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all Bordereau with Queries and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            {/* <Can permission="document_management.create">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/document-management/create`)}
                                >
                                    Add New Bordereau Query
                                </Button>
                            </Can> */}
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">

                            <DataTable columns={columns} data={queryRows} />
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
                }}
                className="max-w-3xl mx-4"
            >
                <div className="p-6 md:p-8">
                    <h3 className="text-lg font-semibold mb-5">
                        (Re)Assign BPC
                    </h3>

                    <Alert
                        variant="info"
                        title="Current BPC"
                        message={assigningRow?.assigned_to ? assigningRow.assigned_to : "No BPC Assigned"}
                        showLink={false}
                    />

                    <div className="mt-4">
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

                    <div className="mt-6 flex justify-end gap-3">
                        <Button
                            variant="danger"
                            onClick={() => {
                                setAssignModalOpen(false);
                                setAssigningRow(null);
                                setAssignModalBpcId("");
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
                                });
                            }}
                            disabled={assignMutation.isPending}
                        >
                            {assignMutation.isPending ? "Assigning..." : "Assign"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}