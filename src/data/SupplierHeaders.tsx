import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { ISupplierSchema } from "@/types/SupplierSchema";

export const getSupplierHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<ISupplierSchema>[] => [
    {
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: () => <div className="ml-4">ID</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("id")}
            </div>
        ),
    },
    {
        accessorKey: "organisation",
        accessorFn: (row) => row.contact?.organisation,
        header: () => <div className="ml-4">Organisation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("organisation")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_name",
        accessorFn: (row) => row.contact?.firstname + " " + row.contact?.lastname,
        header: () => <div className="ml-4">Primary Contact Name</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("primary_contact_name")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_email",
        accessorFn: (row) => row.contact?.email,
        header: () => <div className="ml-4">Primary Contact Email</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("primary_contact_email")}
            </div>
        ),
    },
    {
        accessorKey: "primary_contact_number",
        accessorFn: (row) => row.contact?.mobile,
        header: () => <div className="ml-4">Primary Contact Number</div>,
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

            return (
                <div className="flex gap-1">
                    <Button
                        onClick={() => handleEdit(supplier.id!)}
                        variant="primary"
                        size="xs"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(supplier.id!)}
                        variant="danger"
                        size="xs"
                    >
                        Delete
                    </Button>
                    <Button
                        onClick={() => onDelete(supplier.id!)}
                        variant="success"
                        size="xs"
                    >
                        Supplier Details
                    </Button>
                    <Button
                        onClick={() => onDelete(supplier.id!)}
                        variant="warning"
                        size="xs"
                    >
                        View Staff
                    </Button>
                    <Button
                        onClick={() => onDelete(supplier.id!)}
                        variant="secondary"
                        size="xs"
                    >
                        View Documents
                    </Button>
                </div>
            );
        },
    },
];
