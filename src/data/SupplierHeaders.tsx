import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Payment } from "@/types/payment";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const getSupplierHeaders = (
    navigate: (path: string) => void,
): ColumnDef<Payment>[] => [
    // {
    //     id: "select",
    //     header: ({ table }) => (
    //         <Checkbox
    //             checked={
    //                 table.getIsAllPageRowsSelected() ||
    //                 (table.getIsSomePageRowsSelected() && "indeterminate")
    //             }
    //             onCheckedChange={(value) =>
    //                 table.toggleAllPageRowsSelected(!!value)
    //             }
    //             aria-label="Select all"
    //         />
    //     ),
    //     cell: ({ row }) => (
    //         <Checkbox
    //             checked={row.getIsSelected()}
    //             onCheckedChange={(value) => row.toggleSelected(!!value)}
    //             aria-label="Select row"
    //         />
    //     ),
    //     enableSorting: false,
    //     enableHiding: false,
    // },
    {
        accessorKey: "status",
        header: () => <div className="ml-4">Status</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("status")}
            </div>
        ),
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown />
                </Button>
            );
        },
        cell: ({ row }) => (
            <div className="lowercase dark:text-white">
                {row.getValue("email")}
            </div>
        ),
    },
    {
        accessorKey: "amount",
        header: () => <div>Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("amount"));
            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
            return (
                <div className="font-medium dark:text-white">{formatted}</div>
            );
        },
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const payment = row.original;

            const handleEdit = (id: string) => {
                navigate(`/suppliers/edit/${id}`);
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 dark:text-white"
                        >
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(payment.id)
                            }
                        >
                            Copy payment ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => {
                                handleEdit(payment.id);
                            }}
                        >
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            View payment details
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
