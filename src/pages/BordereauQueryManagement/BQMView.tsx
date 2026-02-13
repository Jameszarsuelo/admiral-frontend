import PageBreadcrumb from "@/components/common/PageBreadCrumb";
// import { useNavigate } from "react-router";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import {  PencilIcon } from "@/icons";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { useQuery } from "@tanstack/react-query";
import { fetchBordereauList } from "@/database/bordereau_api";
import { IBordereauIndex } from "@/types/BordereauSchema";

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

    const { data: queryPayload } = useQuery({
        queryKey: ["bordereau-query-management"],
        queryFn: async () => {
            return await fetchBordereauList({
                invoice_status: "query",
                per_page: 100,
                page: 1,
            });
        },
        staleTime: 1000 * 15,
    });

    const queryRows: BQMType[] = ((queryPayload?.data ?? []) as IBordereauIndex[]).map((b) => {
        const supplierName = (b as any)?.supplier?.name ?? "";
        const statusLabel = (b as any)?.status?.status ?? (b as any)?.bordereau_status?.status ?? "";

        const contact = (b as any)?.bpc?.contact;
        const assignedTo = contact
            ? `${contact.firstname ?? ""} ${contact.lastname ?? ""}`.trim()
            : "";

        const comments = (b as any)?.comments ?? [];
        const latestComment = Array.isArray(comments) && comments.length > 0 ? (comments[comments.length - 1]?.comment ?? "") : "";

        return {
            id: (b as any).id,
            supplier_name: supplierName,
            bordereau: String((b as any).bordereau ?? ""),
            claim_number: String((b as any).claim_number ?? ""),
            name: String((b as any).name ?? ""),
            status: String(statusLabel ?? ""),
            assigned_to: assignedTo,
            target_process_by: String((b as any).target_payment_date ?? ""),
            latest_comment: String(latestComment ?? ""),
        };
    });
   
    const columns: ColumnDef<BQMType>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "supplier_name", header: "Supplier Name" },
        { accessorKey: "bordereau", header: "Bordereau" },
        { accessorKey: "claim_number", header: "Claim Number" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "status", header: "Status" },
        { accessorKey: "assigned_to", header: "Assigned To" },
        { accessorKey: "target_process_by", header: "Target Process by" },
        { accessorKey: "latest_comment", header: "Latest Comment" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original as BQMType;
                console.log(item);
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
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-Select Bordereau Processing Clerk-",
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
                                            {queryPayload?.queryCount ?? queryRows.length}
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
        </>
    );
}