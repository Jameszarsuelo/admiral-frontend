import Button from "@/components/ui/button/Button";
import { Button as CustomButton } from "@/components/ui/button";
import { SupplierResponse } from "@/types/supplier";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const getSupplierHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<SupplierResponse>[] => [
    {
        accessorKey: "salutation",
        accessorFn: (row) => row.user.user_info.salutation,
        header: () => <div className="ml-4">Salutation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("salutation")}.
            </div>
        ),
    },
    {
        accessorKey: "firstname",
        accessorFn: (row) => row.user.firstname,
        header: () => <div className="ml-4">Firstname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("firstname")}
            </div>
        ),
    },
    {
        accessorKey: "lastname",
        accessorFn: (row) => row.user.lastname,
        header: () => <div className="ml-4">Lastname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("lastname")}
            </div>
        ),
    },
    {
        accessorKey: "email",
        accessorFn: (row) => row.user.email,
        header: ({ column }) => {
            return (
                <CustomButton
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown />
                </CustomButton>
            );
        },
        cell: ({ row }) => (
            <div className=" dark:text-white ml-4">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "mobile",
        accessorFn: (row) => row.user.user_info.mobile,
        header: () => <div className="ml-4">Mobile</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("mobile")}
            </div>
        ),
    },
    {
        accessorKey: "address",
        header: () => <div className="ml-4">Address</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.original.user.user_info.city}, {row.original.user.user_info.country},{" "}
                {row.original.user.user_info.postcode}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const supplier = row.original;

            const handleEdit = (id: number) => {
                navigate(`/suppliers/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleEdit(supplier.id!)}
                        variant="primary"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(supplier.id!)}
                        variant="danger"
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
