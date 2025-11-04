import { Payment } from "@/types/payment";
import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "@/components/ui/button";
import { getSupplierHeaders } from "@/data/SupplierHeaders";

const data: Payment[] = [
    {
        id: "m5gr84i9",
        amount: 316,
        status: "success",
        email: "ken99@example.com",
    },
    {
        id: "3u1reuv4",
        amount: 242,
        status: "success",
        email: "Abe45@example.com",
    },
    {
        id: "derv1ws0",
        amount: 837,
        status: "processing",
        email: "Monserrat44@example.com",
    },
    {
        id: "5kma53ae",
        amount: 874,
        status: "success",
        email: "Silas22@example.com",
    },
    {
        id: "bhqecj4p",
        amount: 721,
        status: "failed",
        email: "carmella@example.com",
    },
    {
        id: "qf7jzv3t",
        amount: 429,
        status: "success",
        email: "carmella@example.com",
    },
    {
        id: "x1vscz9o",
        amount: 654,
        status: "processing",
        email: "carmella@example.com",
    },
    {
        id: "p9wz6n2l",
        amount: 538,
        status: "failed",
        email: "carmella@example.com",
    },
    {
        id: "t4yqk8rd",
        amount: 193,
        status: "success",
        email: "carmella@example.com",
    },
    {
        id: "olj3x7hb",
        amount: 765,
        status: "processing",
        email: "carmella@example.com",
    },
];

export default function SupplierView() {
    const navigate = useNavigate();
    const columns = getSupplierHeaders(navigate);

    return (
        <>
            <PageBreadcrumb pageTitle="Suppliers" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Suppliers
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all Suppliers and their details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button size="sm" onClick={() => navigate("/suppliers/new")}>
                                Add New Supplier
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            <DataTable columns={columns} data={data} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
