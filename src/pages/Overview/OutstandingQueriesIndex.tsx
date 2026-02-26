import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    fetchOutstandingQueries,
    type OutstandingQueryRow,
} from "@/database/overview_api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function OutstandingQueriesIndex() {
    const { data, isLoading } = useQuery({
        queryKey: ["overview", "outstanding-queries", "snapshot"],
        queryFn: fetchOutstandingQueries,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
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
                cell: () => (
                    <div className="flex items-center gap-2">
                        <Button size="sm" variant="primary" disabled>
                            View
                        </Button>
                        <Button size="sm" variant="warning" disabled>
                            Assign
                        </Button>
                        <Button size="sm" variant="outline" disabled>
                            Process Now
                        </Button>
                        <Button size="sm" variant="danger" disabled>
                            Close
                        </Button>
                    </div>
                ),
            },
        ],
        [],
    );

    return (
        <>
            <PageBreadcrumb
                pageTitle="Outstanding Queries"
                pageBreadcrumbs={[{ title: "Overview", link: "/overview" }]}
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
        </>
    );
}
