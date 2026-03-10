import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

export interface OverviewBatchActivityRow {
    bordereau_id: number;
    supplier: string;
    bordereau_name: string;
    claim_number: string;
    invoice_number: string;
    name: string;
    customer_name: string;
    bordereau_status: string;
    comments: string;
    target_process_by: string;
}

export function getOverviewBatchActivitiesColumns(): ColumnDef<OverviewBatchActivityRow>[] {
    return [
        {
            accessorKey: "supplier",
            header: "Supplier Name",
            cell: ({ row }) => <div>{String(row.getValue("supplier") ?? "-")}</div>,
        },
        {
            accessorKey: "bordereau_name",
            header: "Bordereau Name",
            cell: ({ row }) => (
                <div>{String(row.getValue("bordereau_name") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "claim_number",
            header: "Claim Number",
            cell: ({ row }) => <div>{String(row.getValue("claim_number") ?? "-")}</div>,
        },
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div>{String(row.getValue("name") ?? "-")}</div>,
        },
        {
            accessorKey: "bordereau_status",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant="secondary">
                    <BadgeCheckIcon className="mr-1 inline-block" />
                    {String(row.getValue("bordereau_status") ?? "-")}
                </Badge>
            ),
        },
        {
            accessorKey: "comments",
            header: "Comments",
            cell: ({ row }) => (
                <div className="max-w-[520px] whitespace-pre-wrap break-words">
                    {String(row.getValue("comments") ?? "") || "-"}
                </div>
            ),
        },
        {
            accessorKey: "target_process_by",
            header: "Target Process By",
            cell: ({ row }) => (
                <div>{String(row.getValue("target_process_by") ?? "-")}</div>
            ),
        },
    ];
}
