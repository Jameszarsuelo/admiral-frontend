import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    fetchTimTodaySnapshot,
    type TimTodayRow,
} from "@/database/overview_api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function TimTodayIndex() {
    const { data, isLoading } = useQuery({
        queryKey: ["overview", "tim-today", "snapshot"],
        queryFn: fetchTimTodaySnapshot,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const headlineValue = data?.headline_aht ?? "00:00:00";

    const rows = data?.rows ?? [];

    const columns = useMemo<ColumnDef<TimTodayRow>[]>(
        () => [
            {
                accessorKey: "supplier",
                header: "Supplier",
                cell: ({ row }) => <div>{String(row.getValue("supplier") ?? "-")}</div>,
            },
            {
                accessorKey: "bordereau_name",
                header: "Bordereau Name",
                cell: ({ row }) => (
                    <div>{String(row.getValue("bordereau_name") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "activities_count",
                header: "#Activities",
                cell: ({ row }) => (
                    <div>{String(row.getValue("activities_count") ?? 0)}</div>
                ),
            },
            {
                accessorKey: "completed_count",
                header: "#Completed",
                cell: ({ row }) => (
                    <div>{String(row.getValue("completed_count") ?? 0)}</div>
                ),
            },
            {
                accessorKey: "success_count",
                header: "#Success",
                cell: ({ row }) => (
                    <div>{String(row.getValue("success_count") ?? 0)}</div>
                ),
            },
            {
                accessorKey: "query_count",
                header: "#Query",
                cell: ({ row }) => <div>{String(row.getValue("query_count") ?? 0)}</div>,
            },
            {
                accessorKey: "agents_count",
                header: "#Agents",
                cell: ({ row }) => <div>{String(row.getValue("agents_count") ?? 0)}</div>,
            },
            {
                accessorKey: "aht_completed",
                header: "AHT Completed",
                cell: ({ row }) => (
                    <div>{String(row.getValue("aht_completed") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "aht_queried",
                header: "AHT Queried (So Far)",
                cell: ({ row }) => (
                    <div>{String(row.getValue("aht_queried") ?? "-")}</div>
                ),
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="primary"
                            onClick={() => {
                                const params = new URLSearchParams({
                                    search: row.original.bordereau_name,
                                    supplier_id: String(row.original.supplier_id ?? ""),
                                });

                                const targetUrl = `/bordereau-detail?${params.toString()}`;
                                const opened = window.open(
                                    targetUrl,
                                    "_blank",
                                    "noopener,noreferrer,width=1200,height=900",
                                );

                                if (!opened) {
                                    window.location.href = targetUrl;
                                }
                            }}
                        >
                            View
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
                pageTitle="TIM (Today)"
                pageBreadcrumbs={[{ title: "Overview", link: "/overview" }]}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics
                        label="AHT All Processed Activities (Today)"
                        value={headlineValue}
                    />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    TIM (Today)
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
