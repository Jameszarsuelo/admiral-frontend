import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSupplierStatistics } from "@/database/supplier_api";
import { ISupplierStatisticsSchema } from "@/types/SupplierSchema";
import Spinner from "@/components/ui/spinner/Spinner";
import { dateFormat } from "@/helper/dateFormat";
import SupplierContactsTable from "./SupplierContactsTable/SupplierContactTable";

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

    const supplierDetails = [
        {
            label: "Invoices Received",
            value: supplier?.bordereau?.length ?? "0",
        },
        {
            label: "Invoices Processed",
            // b.bordereau_status_id !== [1, 2, 3]
            value:
                supplier?.bordereau
                    ?.filter(
                        (b) =>
                            [1, 2, 3].includes(b.bordereau_status_id!) ===
                            false,
                    )
                    .length.toString() ?? "0",
        },
        {
            label: "Invoices Paid",
            value:
                supplier?.bordereau
                    ?.filter((b) => b.bordereau_status_id === 9)
                    .length.toString() ?? "0",
        },
        {
            label: "Invoices Queuried",
            value:
                supplier?.bordereau
                    ?.filter((b) => b.bordereau_status_id === 3)
                    .length.toString() ?? "0",
        },
        {
            label: "Average Payment Days",
            value: "0",
        },
        {
            label: "Target Payment Days",
            value: supplier?.target_payment_days?.toString() ?? "0",
        },
        {
            label: "Max Payment Days",
            value: supplier?.max_payment_days?.toString() ?? "0",
        },
        {
            label: "IPC Avg Handle Time",
            value: "0",
        },
    ];

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
                        <div className="min-w-full xl:min-w-full px-2">
                            {isLoading ? (
                                <Spinner />
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-2 ">
                                        <div className="grid grid-cols-1 gap-6">
                                            <div className="w-full">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                    {supplierDetails.map(
                                                        (card, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-md"
                                                            >
                                                                <div className="flex-shrink-0">
                                                                    <div className="h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900 flex items-center justify-center">
                                                                        <svg
                                                                            width="20"
                                                                            height="20"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            className="text-cyan-600"
                                                                        >
                                                                            <path
                                                                                d="M12 2L12 22"
                                                                                stroke="#0891B2"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                            <path
                                                                                d="M5 7H19"
                                                                                stroke="#0891B2"
                                                                                strokeWidth="1.5"
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                            />
                                                                        </svg>
                                                                    </div>
                                                                </div>

                                                                <div className="flex flex-col min-w-0">
                                                                    <div className="text-sm text-slate-500 dark:text-slate-300 font-medium truncate">
                                                                        {
                                                                            card.label
                                                                        }
                                                                    </div>
                                                                    <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white truncate">
                                                                        {
                                                                            card.value
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            <div className="grid lg:grid-cols-3 grid-cols-1 gap-6"></div>
                                        </div>
                                        <div className="grid lg:grid-cols-3 grid-cols-1 gap-6">
                                            <div className="col-span-full">
                                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                                    {supplier?.name ?? "-"}
                                                </h4>
                                                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Generic Phone Number
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.phone ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Invoice Query Email
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.phone ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Phone
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.phone ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Primary Contact
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.contact
                                                                ?.firstname
                                                                ? `${
                                                                      supplier
                                                                          .contact
                                                                          .firstname
                                                                  } ${
                                                                      supplier
                                                                          .contact
                                                                          .lastname ??
                                                                      ""
                                                                  }`
                                                                : "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Supplier Priority
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.priority ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Preferred Payment
                                                            Day
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.preferred_payment_day ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Address
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.address_line_1 && (
                                                                <>
                                                                    {
                                                                        supplier.address_line_1
                                                                    }
                                                                    <br />
                                                                </>
                                                            )}
                                                            {supplier?.address_line_2 && (
                                                                <>
                                                                    {
                                                                        supplier.address_line_2
                                                                    }
                                                                    <br />
                                                                </>
                                                            )}
                                                            {supplier?.address_line_3 && (
                                                                <>
                                                                    {
                                                                        supplier.address_line_3
                                                                    }
                                                                    <br />
                                                                </>
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            City / Town
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.city ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Country
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.country ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            County
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.county ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Post Code
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.postcode ??
                                                                "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Created Date
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.created_at
                                                                ? dateFormat(
                                                                      supplier?.created_at,
                                                                  )
                                                                : "-"}
                                                        </p>
                                                    </div>

                                                    <div>
                                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                                            Updated Date
                                                        </p>
                                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                                            {supplier?.updated_at
                                                                ? dateFormat(
                                                                      supplier?.updated_at,
                                                                  )
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-2 ">
                                            <SupplierContactsTable supplierId={id}/>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
