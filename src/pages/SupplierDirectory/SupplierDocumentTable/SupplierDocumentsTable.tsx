import { DataTable } from "@/components/ui/DataTable";
import { DocumentHeaders } from "@/data/DocumentHeaders";

export type Payment = {
    id: string;
    amount: number;
    status: "pending" | "processing" | "success" | "failed";
    email: string;
};

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
];

export default function SupplierDocumentsTable() {
    const columns = DocumentHeaders;
    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] xl:min-w-full px-2">
                <DataTable columns={columns} data={data} />
                {/* {!isLoading && supplierData ? (
                    <DataTable columns={columns} data={supplierData} />
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )} */}
            </div>
        </div>
    );
}
