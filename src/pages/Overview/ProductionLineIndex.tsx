import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchProductionLineToday } from "@/database/overview_api";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type ProductionLineTableRow = {
    supplier_name: string;
    total_outstanding: number;
    is_grand_total?: boolean;
} & Record<string, number | string | boolean>;

export default function ProductionLineIndex() {
    const { data, isLoading } = useQuery({
        queryKey: ["overview", "production-line", "today", "snapshot"],
        queryFn: fetchProductionLineToday,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    });

    const headlineValue = `${data?.oldest_queued_days ?? 0} day(s)`;

    const tableData: ProductionLineTableRow[] = useMemo(() => {
        const rows = data?.rows ?? [];

        const mappedRows = rows.map((row) => {
            const flattened: ProductionLineTableRow = {
                supplier_name: row.supplier_name,
                total_outstanding: row.total_outstanding,
            };

            for (const [day, count] of Object.entries(row.buckets ?? {})) {
                flattened[`day_${day}`] = count;
            }

            return flattened;
        });

        const dayTotals: Record<string, number> = {};
        for (const day of data?.bucket_days ?? []) {
            dayTotals[`day_${day}`] = mappedRows.reduce((acc, row) => {
                const value = row[`day_${day}`];
                return acc + (typeof value === "number" ? value : 0);
            }, 0);
        }

        const grandTotalRow: ProductionLineTableRow = {
            supplier_name: "Grand Total",
            total_outstanding: mappedRows.reduce(
                (acc, row) => acc + (row.total_outstanding ?? 0),
                0,
            ),
            is_grand_total: true,
            ...dayTotals,
        };

        return [...mappedRows, grandTotalRow];
    }, [data]);

    const columns = useMemo<ColumnDef<ProductionLineTableRow>[]>(() => {
        const base: ColumnDef<ProductionLineTableRow>[] = [
            {
                accessorKey: "supplier_name",
                header: "Supplier",
                cell: ({ row }) => {
                    const isGrandTotal = Boolean(row.original.is_grand_total);
                    return (
                        <div className={isGrandTotal ? "font-semibold" : ""}>
                            {String(row.getValue("supplier_name") ?? "-")}
                        </div>
                    );
                },
            },
            {
                accessorKey: "total_outstanding",
                header: "Grand Total",
                cell: ({ row }) => {
                    const isGrandTotal = Boolean(row.original.is_grand_total);
                    return (
                        <div className={isGrandTotal ? "font-semibold" : ""}>
                            {String(row.getValue("total_outstanding") ?? 0)}
                        </div>
                    );
                },
            },
        ];

        const dayColumns: ColumnDef<ProductionLineTableRow>[] =
            (data?.bucket_days ?? []).map((day) => ({
                accessorKey: `day_${day}`,
                header: `${day} day(s) old`,
                cell: ({ row }) => {
                    const rawValue = row.getValue(`day_${day}`);
                    const value = typeof rawValue === "number" ? rawValue : 0;
                    const isGrandTotal = Boolean(row.original.is_grand_total);

                    return (
                        <div className={isGrandTotal ? "font-semibold" : ""}>
                            {value > 0 ? String(value) : ""}
                        </div>
                    );
                },
            }));

        return [base[0], ...dayColumns, base[1]];
    }, [data]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Production Line"
                pageBreadcrumbs={[{ title: "Overview", link: "/overview" }]}
            />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics
                        label="Oldest Queued Bordereau"
                        value={headlineValue}
                    />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    Aged Outstanding Activities by Supplier
                                </h3>
                                <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                    Snapshot for today grouped by age-day bucket.
                                </p>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto custom-scrollbar">
                            <div className="min-w-[1000px] xl:min-w-full px-2">
                                {!isLoading ? (
                                    <DataTable columns={columns} data={tableData} />
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
