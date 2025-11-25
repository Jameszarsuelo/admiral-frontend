import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchSupplierDocuments } from "@/database/supplier_api";
import { getSupplierDocumentHeaders } from "./SupplierDocumentHeaders";

export default function SupplierDocumentsTable({
    supplierId,
}: {
    supplierId: number | string | undefined;
}) {
    const {
        data: supplierDocumentData,
        isLoading,
        // refetch,
    } = useQuery({
        queryKey: ["supplier-documents", supplierId],
        queryFn: async () => {
            return await fetchSupplierDocuments(supplierId as number);
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    const columns = getSupplierDocumentHeaders();

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] xl:min-w-full px-2">
                {!isLoading && supplierDocumentData ? (
                    <DataTable columns={columns} data={supplierDocumentData} />
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
