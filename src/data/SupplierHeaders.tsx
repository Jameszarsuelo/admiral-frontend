import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { ISupplierSchema } from "@/types/SupplierSchema";
import Can from "@/components/auth/Can";

export const getSupplierHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
    handleStaffModal: (id: number) => void,
    handleContactModal: (id: number) => void
): ColumnDef<ISupplierSchema>[] => [
    {
        accessorKey: "organisation",
        accessorFn: (row) => row.name,
        header: "Supplier",
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("organisation")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_name",
        accessorFn: (row) =>
            row.contact?.firstname + " " + row.contact?.lastname,
        header: "Primary Contact Name",
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("primary_contact_name")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_email",
        accessorFn: (row) => row.contact?.email,
        header: "Primary Contact Email",
        cell: ({ row }) => (
            <div className=" dark:text-white ml-4">
                {row.getValue("primary_contact_email")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_number",
        accessorFn: (row) => row.contact?.mobile,
        header: "Primary Contact Number",
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("primary_contact_number")}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const supplier = row.original;

            const handleEdit = (id: number) => {
                navigate(`/supplier-directory/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            const handleNavigateToDetails = (id: number) => {
                navigate(`/supplier-directory/view/${id}`);
            };

            return (
                <div className="flex gap-1">
                    <Can permission="supplier_directory.edit">
                        <Button
                            onClick={() => handleEdit(supplier.id!)}
                            variant="primary"
                            size="xs"
                        >
                            Edit
                        </Button>
                    </Can>
                    <Can permission="supplier_directory.delete">
                        <Button
                            onClick={() => onDelete(supplier.id!)}
                            variant="danger"
                            size="xs"
                        >
                            Delete
                        </Button>
                    </Can>
                    <Can permission="supplier_directory.view">
                        <Button
                            onClick={() =>
                                handleNavigateToDetails(supplier.id!)
                            }
                            variant="success"
                            size="xs"
                        >
                            Supplier Details
                        </Button>
                    </Can>
                    <Can permission="supplier_directory.view_staff">
                        <Button
                            onClick={() => handleStaffModal(supplier.id!)}
                            variant="warning"
                            size="xs"
                        >
                            View Staff
                        </Button>
                    </Can>
                    <Can permission="supplier_directory.view_documents">
                        <Button
                            onClick={() => handleContactModal(supplier.id!)}
                            variant="outline"
                            className="bg-[#00B0F0]! text-white!"
                            size="xs"
                        >
                            View Documents
                        </Button>
                    </Can>
                </div>
            );
        },
    },
];
