import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchSupplierContacts } from "@/database/supplier_api";
import { getSupplierContactHeaders } from "./SupplierContactHeaders";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { IContactCreateSchema } from "@/types/ContactSchema";

export default function SupplierContactsTable({
    supplierId,
}: {
    supplierId: number | string | undefined;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<
        IContactCreateSchema | null
    >(null);
    const {
        data: contactData,
        isLoading,
        // refetch,
    } = useQuery({
        queryKey: ["contact-data", supplierId],
        queryFn: async () => {
            return await fetchSupplierContacts(supplierId as string);
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    // const removeContacts = (id: number) => {

    // };

    const handleView = (contact: IContactCreateSchema) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const columns = getSupplierContactHeaders(handleView);

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

            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedContact(null);
                }}
                className="max-w-3xl p-6"
            >
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Contact Details
                        </h4>

                        {selectedContact ? (
                            <div className="mt-4">
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Salutation</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90 capitalize">{selectedContact.salutation}.</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">First Name</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.firstname}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Last Name</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.lastname}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Landline Phone Number</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.phone}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Mobile Phone Number</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.mobile}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.email}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Contact Type</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.type == "1" ? "Contact" : selectedContact.type == "2" ? "Supplier" : "User"}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Organisation</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.organisation}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Address</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.address_line_1}</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.address_line_2}</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.address_line_3}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">City / Town</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.city}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">County</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.county}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Country</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.country}</p>
                                        </div>

                                        <div>
                                            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Postcode</p>
                                            <p className="text-md font-medium text-gray-800 dark:text-white/90">{selectedContact.postcode}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-center py-8">
                                <Spinner size="md" />
                            </div>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}
