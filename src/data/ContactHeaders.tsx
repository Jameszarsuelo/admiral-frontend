import Button from "@/components/ui/button/Button";
import { Button as CustomButton } from "@/components/ui/button";
import { IContactHeaderSchema } from "@/types/ContactSchema";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Can from "@/components/auth/Can";

export const getContactHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IContactHeaderSchema>[] => [
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
        cell: ({ row }) => {
            const type = row.getValue("type") as number;
            const bgColor = type === 1 ? "#97e3ff" : type === 2 ? "#ffbbf7" : "#92D050";
            // const textColor = type === 2 ? "#000000" : "#FFFFFF";

            return (
                <Badge 
                    className="ml-4 inline-flex items-center"
                    style={{ backgroundColor: bgColor, color: "#000000" }}
                >
                    <BadgeCheckIcon className="mr-1 inline-block" />
                    {type === 1 ? "Contact" : type === 2 ? "Supplier" : "User"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const bpc = row.original;
            const type = row.original.type;
            const userId = row.original.user?.id;

            const handleEdit = (id: number) => {
                if (Number(type) === 1) {
                    navigate(`/contact-directory/edit/${id}`);
                } else if(Number(type) === 2) {
                    navigate(`/supplier-users/edit/${userId}`);
                } else {
                    navigate(`/users/edit/${userId}`);
                }
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            const handleView = (id: number) => {
                navigate(`/contact-directory/view/${id}`);
            };

            return (
                <div className="flex gap-2">
                    <Can permission="contact_directory.edit">
                        <Button
                            onClick={() => handleEdit(bpc.id!)}
                            variant="warning"
                            size="sm"
                        >
                            Edit
                        </Button>
                    </Can>
                    <Can permission="contact_directory.delete">
                        <Button
                            onClick={() => onDelete(bpc.id!)}
                            variant="danger"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </Can>
                    <Can permission="contact_directory.view">
                        <Button
                            onClick={() => handleView(bpc.id!)}
                            variant="info"
                            size="sm"
                        >
                            View
                        </Button>
                    </Can>
                </div>
            );
        },
    },
];
