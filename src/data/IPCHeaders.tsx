// import { Checkbox } from "@/components/ui/checkbox";
import Button from "@/components/ui/button/Button";

import { Button as CustomButton } from "@/components/ui/button";
import { IPCResponse } from "@/types/ipc";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

export const getIPCHeaders = (
    navigate: (path: string) => void,
): ColumnDef<IPCResponse>[] => [
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
        accessorKey: "salutation",
        header: () => <div className="ml-4">Salutation</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.original.user_info.salutation}.
            </div>
        ),
    },
    {
        accessorKey: "firstname",
        header: () => <div className="ml-4">Firstname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("firstname")}
            </div>
        ),
    },
    {
        accessorKey: "lastname",
        header: () => <div className="ml-4">Lastname</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("lastname")}
            </div>
        ),
    },
    {
        accessorKey: "email",
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
        header: () => <div className="ml-4">Mobile</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.original.user_info.mobile}
            </div>
        ),
    },
    {
        accessorKey: "address",
        header: () => <div className="ml-4">Address</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.original.user_info.city}, {" "}
                {row.original.user_info.country},{" "}
                {row.original.user_info.postcode}
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
    //         <div className="lowercase dark:text-white">{row.getValue("email")}</div>
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
    //         return <div className="font-medium dark:text-white">{formatted}</div>;
    //     },
    // },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const ipc = row.original;

            const handleEdit = (id: number) => {
                navigate(`/invoice-payment-clerk/edit/${id}`);
            };

            return (
                <Button
                    onClick={() => handleEdit(ipc.id)}
                    variant="primary"
                    size="sm"
                >
                    Edit
                </Button>
            );
        },
    },
];
