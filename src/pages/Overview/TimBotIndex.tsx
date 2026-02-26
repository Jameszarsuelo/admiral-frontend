import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    fetchTimBotSnapshot,
    type TimBotRow,
} from "@/database/overview_api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

export default function TimBotIndex() {
    const { data, isLoading } = useQuery({
        queryKey: ["overview", "tim-bot", "snapshot"],
        queryFn: fetchTimBotSnapshot,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const headlineValue = data?.headline_aht ?? "00:00:00";

    const rows = data?.rows ?? [];

    const columns = useMemo<ColumnDef<TimBotRow>[]>(() => {
        const supplierColumn: ColumnDef<TimBotRow> = {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => <div>{String(row.getValue("supplier") ?? "-")}</div>,
        };

        const monthColumns: ColumnDef<TimBotRow>[] = (data?.months ?? []).map((m) => ({
            id: `month_${m.key}`,
            header: m.label,
            cell: ({ row }) => {
                const value = row.original.months?.[m.key] ?? "";
                return <div>{value}</div>;
            },
        }));

        const grandTotalColumn: ColumnDef<TimBotRow> = {
            accessorKey: "grand_total",
            header: "Grand Total",
            cell: ({ row }) => <div>{String(row.getValue("grand_total") ?? "")}</div>,
        };

        return [supplierColumn, ...monthColumns, grandTotalColumn];
    }, [data]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="TIM (BoT)"
                pageBreadcrumbs={[{ title: "Overview", link: "/overview" }]}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics
                        label="AHT All Processed Activities (BoT)"
                        value={headlineValue}
                    />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Average handle time by month by supplier
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
