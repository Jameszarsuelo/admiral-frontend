import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    fetchForecastSnapshot,
    type ForecastRow,
} from "@/database/overview_api";
import { queueBordereauForBpc } from "@/database/bordereau_api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";

export default function ForecastIndex() {
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
        queryKey: ["overview", "forecast", "snapshot", departmentIdNumber],
        queryFn: () => fetchForecastSnapshot(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const processNextMutation = useMutation({
        mutationFn: async (bordereauId: number) => {
            await queueBordereauForBpc({ bordereau_id: bordereauId });
        },
        onSuccess: () => {
            toast.success("Bordereau queued to process next");
            void queryClient.invalidateQueries({ queryKey: ["overview", "forecast"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to queue bordereau for processing";
            toast.error(message);
        },
    });

    const headlineValue = `${Number(data?.projected_days ?? 0).toFixed(2)} day(s)`;

    const rows = data?.rows ?? [];

    const columns = useMemo<ColumnDef<ForecastRow>[]>(
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
                accessorKey: "status",
                header: "Status",
                cell: ({ row }) => <div>{String(row.getValue("status") ?? "-")}</div>,
            },
            {
                accessorKey: "activities_outstanding",
                header: "#Activities Outstanding",
                cell: ({ row }) => (
                    <div>{String(row.getValue("activities_outstanding") ?? 0)}</div>
                ),
            },
            {
                accessorKey: "agents_qualified",
                header: "#Agents Qualified",
                cell: ({ row }) => (
                    <div>{String(row.getValue("agents_qualified") ?? 0)}</div>
                ),
            },
            {
                accessorKey: "aht_completed",
                header: "AHT Completed",
                cell: ({ row }) => (
                    <div>{String(row.getValue("aht_completed") ?? "-")}</div>
                ),
            },
            {
                accessorKey: "duration",
                header: "Duration",
                cell: ({ row }) => <div>{String(row.getValue("duration") ?? "-")}</div>,
            },
            {
                id: "actions",
                header: "Actions",
                cell: ({ row }) => {
                    const bordereauId = row.original.bordereau_id;

                    return (
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
                            <Button
                                size="sm"
                                variant="warning"
                                disabled={
                                    processNextMutation.isPending ||
                                    row.original.activities_outstanding <= 0
                                }
                                onClick={() => processNextMutation.mutate(bordereauId)}
                            >
                                Process Next
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [processNextMutation],
    );

    return (
        <>
            <PageBreadcrumb
                pageTitle="Forecast"
                pageBreadcrumbs={[{ title: "Overview", link: overviewLink }]}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics
                        label="Projected Days to Clear Pipeline"
                        value={headlineValue}
                    />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Pipe-line Forecast (Excluding Queries)
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
