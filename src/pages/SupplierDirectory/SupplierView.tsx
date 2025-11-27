import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSupplierStatistics } from "@/database/supplier_api";
import { ISupplierStatisticsSchema } from "@/types/SupplierSchema";
import SupplierDetailsView from "./SupplierDetailsView";

export default function SupplierView() {
    const { id } = useParams();

    const { data: supplier, isLoading } =
        useQuery<ISupplierStatisticsSchema | null>({
            queryKey: ["supplierDetail", id],
            queryFn: async () => {
                return await fetchSupplierStatistics(String(id));
            },
            enabled: !!id,
        });

    console.log(supplier);

    return (
        <>
            <PageBreadcrumb pageTitle="View Supplier Detail" />

            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Supplier Detail View
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                Displaying detailed information about the
                                selected supplier.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <SupplierDetailsView
                            isLoading={isLoading}
                            supplier={supplier ?? null}
                            id={id}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
