import Button from "@/components/ui/button/Button";
import { Button as CustomButton } from "@/components/ui/button";
import { IContactCreateSchema } from "@/types/ContactSchema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const getContactHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IContactCreateSchema>[] => [
    {
        accessorKey: "salutation",
        accessorFn: (row) => row.salutation,
        header: () => <div className="ml-4">Salutation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("salutation")}.
            </div>
        ),
    },
    {
        accessorKey: "name",
        accessorFn: (row) => `${row.firstname} ${row.lastname}`,
        header: () => <div className="ml-4">Firstname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("name")}
            </div>
        ),
    },
    {
        accessorKey: "email",
        accessorFn: (row) => row.email,
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
        accessorKey: "organisation",
        accessorFn: (row) => row.organisation,
        header: () => <div className="ml-4">Organisation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("organisation")}
            </div>
        ),
    },
    {
        accessorKey: "mobile",
        accessorFn: (row) => row.mobile,
        header: () => <div className="ml-4">Mobile</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("mobile")}
            </div>
        ),
    },
    {
        accessorKey: "phone",
        accessorFn: (row) => row.phone,
        header: () => <div className="ml-4">Landline</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("phone")}
            </div>
        ),
    },
    {
        accessorKey: "type",
        accessorFn: (row) => row.type,
        header: () => <div className="ml-4">Contact Type</div>,
        cell: ({ row }) => (
            <Badge
                variant="secondary"
                className="ml-4 inline-flex items-center"
            >
                <BadgeCheckIcon className="mr-1 inline-block" />
                {row.getValue("type") === 1
                    ? "Contact"
                    : row.getValue("type") === 2
                    ? "Supplier"
                    : "User"}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const ipc = row.original;

            const handleEdit = (id: number) => {
                navigate(`/contact-directory/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleEdit(ipc.id!)}
                        variant="primary"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(ipc.id!)}
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
