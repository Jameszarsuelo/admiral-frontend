import Button from "@/components/ui/button/Button";
import { Button as CustomButton } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { IBPCSchema } from "@/types/BPCSchema";

export const getBPCHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IBPCSchema>[] => [
    // {
    //     accessorKey: "salutation",
    //     accessorFn: (row) => row.contact.salutation,
    //     header: () => <div className="ml-4">Salutation</div>,
    //     cell: ({ row }) => (
    //         <div className="capitalize dark:text-white ml-4">
    //             {row.getValue("salutation")}.
    //         </div>
    //     ),
    // },
    {
        accessorKey: "firstname",
        accessorFn: (row) => row.contact.firstname,
        header: () => <div className="ml-4">Firstname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("firstname")}
            </div>
        ),
    },
    {
        accessorKey: "lastname",
        accessorFn: (row) => row.contact.lastname,
        header: () => <div className="ml-4">Lastname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("lastname")}
            </div>
        ),
    },
    {
        accessorKey: "email",
        accessorFn: (row) => row.contact.email,
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
        accessorFn: (row) => row.contact.mobile,
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
                {row.original.contact.city}, {row.original.contact.country},{" "}
                {row.original.contact.postcode}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const bpc = row.original;

            const handleEdit = (id: number) => {
                navigate(`/bordereau-payment-clerk/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleEdit(bpc.id!)}
                        variant="primary"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(bpc.id!)}
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
