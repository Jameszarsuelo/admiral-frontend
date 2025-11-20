import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchSupplierContacts } from "@/database/supplier_api";
import { getSupplierContactHeaders } from "./SupplierContactHeaders";

export default function SupplierContactsTable({
    supplierId,
}: {
    supplierId: number | string | undefined;
}) {
    const {
        data: contactData,
        isLoading,
        // refetch,
    } = useQuery({
        queryKey: ["contact-data"],
        queryFn: async () => {
            return await fetchSupplierContacts(supplierId as string);
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    const columns = getSupplierContactHeaders();

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] xl:min-w-full px-2">
                {!isLoading && contactData ? (
                    <DataTable columns={columns} data={contactData} />
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
