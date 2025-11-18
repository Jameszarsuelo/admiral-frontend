import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button/Button";
import { IInvoiceSchema } from "@/types/BordereauSchema";
import { BadgeCheckIcon } from "lucide-react";

export const getInvoiceHeaders = (): ColumnDef<IInvoiceSchema>[] => [
    {
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: "Platform ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "status",
        accessorFn: (row) => row.invoice_status.status,
        header: "Status",
        cell: ({ row }) => (
            <Badge
                variant="secondary"
            >
                <BadgeCheckIcon className="mr-1 inline-block" />
                {row.getValue("status")}
            </Badge>
        ),
    },
    {
        accessorKey: "supplier",
        accessorFn: (row) => row.supplier.name,
        header: "Supplier",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("supplier")}</div>
        ),
    },
    {
        accessorKey: "invoice_number",
        accessorFn: (row) => row.invoice_number,
        header: "Invoice Number",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("invoice_number")}</div>
        ),
    },
    {
        accessorKey: "amount",
        accessorFn: (row) => row.invoice_info.amount_due_total,
        header: "Amount",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("amount")}</div>
        ),
    },
    {
        accessorKey: "deadline",
        accessorFn: (row) => row.deadline_payment_date,
        header: "Deadline",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("deadline")}</div>
        ),
    },
    {
        accessorKey: "ideal_pay_by",
        accessorFn: (row) => row.target_payment_date,
        header: "Ideal Pay By",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("ideal_pay_by")}</div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Uploaded On",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("created_at")}</div>
        ),
    },
    {
        accessorKey: "assigned_to",
        accessorFn: (row) => {
            if (row.ipc !== null) {
                return row.ipc?.contact.firstname + " " + row.ipc?.contact.lastname;
            }
            return "Unassigned";
        },
        header: "Assigned To",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("assigned_to")}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: () => {
            return (
                <div className="flex gap-1">
                    <Button variant="primary" size="xs">
                        View
                    </Button>
                    <Button variant="warning" size="xs">
                        Assign
                    </Button>
                    <Button variant="outline" size="xs">
                        Pay Now
                    </Button>
                    <Button variant="danger" size="xs">
                        Close
                    </Button>
                </div>
            );
        },
    },
];
