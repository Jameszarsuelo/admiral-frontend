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
import { IUserList } from "@/types/user";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

export const getUserHeaders = (
    navigate: (path: string) => void,
): ColumnDef<IUserList>[] => [
    {
        accessorKey: "salutation",
        accessorFn: (row) => row.user_info.salutation,
        header: () => <div className="ml-4">Salutation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("salutation")}
            </div>
        ),
    },
    // {
    //     accessorKey: "email",
    //     header: ({ column }) => {
    //         return (
    //             <Button
    //                 variant="ghost"
    //                 onClick={() =>
    //                     column.toggleSorting(column.getIsSorted() === "asc")
    //                 }
    //             >
    //                 Email
    //                 <ArrowUpDown />
    //             </Button>
    //         );
    //     },
    //     cell: ({ row }) => (
    //         <div className="lowercase dark:text-white">
    //             {row.getValue("email")}
    //         </div>
    //     ),
    // },
    // {
    //     accessorKey: "amount",
    //     header: () => <div>Amount</div>,
    //     cell: ({ row }) => {
    //         const amount = parseFloat(row.getValue("amount"));
    //         // Format the amount as a dollar amount
    //         const formatted = new Intl.NumberFormat("en-US", {
    //             style: "currency",
    //             currency: "USD",
    //         }).format(amount);
    //         return (
    //             <div className="font-medium dark:text-white">{formatted}</div>
    //         );
    //     },
    // },
    // {
    //     id: "actions",
    //     header: () => <div>Actions</div>,
    //     cell: ({ row }) => {
    //         const payment = row.original;

    //         const handleEdit = (id: string) => {
    //             navigate(`/users/edit/${id}`);
    //         };

    //         return (
    //             <DropdownMenu>
    //                 <DropdownMenuTrigger asChild>
    //                     <Button
    //                         variant="ghost"
    //                         className="h-8 w-8 p-0 dark:text-white"
    //                     >
    //                         <span className="sr-only">Open menu</span>
    //                         <MoreHorizontal />
    //                     </Button>
    //                 </DropdownMenuTrigger>
    //                 <DropdownMenuContent align="end">
    //                     <DropdownMenuLabel>Actions</DropdownMenuLabel>
    //                     <DropdownMenuItem
    //                         onClick={() =>
    //                             navigator.clipboard.writeText(payment.id)
    //                         }
    //                     >
    //                         Copy payment ID
    //                     </DropdownMenuItem>
    //                     <DropdownMenuSeparator />
    //                     <DropdownMenuItem
    //                         onClick={() => {
    //                             handleEdit(payment.id);
    //                         }}
    //                     >
    //                         Edit
    //                     </DropdownMenuItem>
    //                     <DropdownMenuItem>
    //                         View payment details
    //                     </DropdownMenuItem>
    //                 </DropdownMenuContent>
    //             </DropdownMenu>
    //         );
    //     },
    // },
];
