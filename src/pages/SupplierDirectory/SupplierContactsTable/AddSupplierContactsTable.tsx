import { DataTable } from "@/components/ui/DataTable";
import { getAddSupplierContactHeaders } from "./AddSupplierContactHeaders";
import { fetchContactOptions } from "@/database/contact_api";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import Spinner from "@/components/ui/spinner/Spinner";
import { Button } from "@/components/ui/button";
import { useCallback, useState } from "react";
import { IContactSchema } from "@/types/ContactSchema";
import { addContactsToSupplier } from "@/database/supplier_api";
import { toast } from "sonner";

export default function AddSupplierContactsTable({
    supplierId,
    setIsDocsModalOpen,
}: {
    supplierId: number | string | undefined;
    setIsDocsModalOpen?: (open: boolean) => void;
}) {
    const {
        data: contactData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["contact-data"],
        queryFn: async () => {
            return await fetchContactOptions();
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: true,
        // staleTime: 500,
        // gcTime: 20000,
    });

    const columns = getAddSupplierContactHeaders();
    const [selectedContacts, setSelectedContacts] = useState<IContactSchema[]>(
        [],
    );

    const handleAddToContacts = useCallback(async () => {
        await addContactsToSupplier(supplierId, selectedContacts);
        refetch();
        setIsDocsModalOpen?.(false);
        toast.success("Contacts added to Supplier successfully");
        // setSelectedContacts([]);
    }, [supplierId, selectedContacts, refetch, setIsDocsModalOpen]);

    const handleSelectionChange = useCallback(
        (rows: IContactSchema[]) => setSelectedContacts(rows),
        [],
    );

    return (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
            <div className="min-w-[1000px] xl:min-w-full px-2">
                <Button
                    variant="default"
                    onClick={handleAddToContacts}
                    disabled={selectedContacts.length === 0}
                >
                    Add to Contacts
                </Button>
                {!isLoading && contactData ? (
                    <DataTable
                        columns={
                            columns as ColumnDef<IContactSchema, unknown>[]
                        }
                        data={contactData as IContactSchema[]}
                        onRowSelectionChange={handleSelectionChange}
                    />
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}
            </div>
        </div>
    );
}
