import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";
import Button from "@/components/ui/button/Button";

export interface UploadExceptionActivityRow {
    bordereau_id: number;
    supplier: string;
    bordereau_name: string;
    claim_number: string;
    bordereau_status: string;
    comments: string;
    target_process_by: string;
}

export function getUploadExceptionActivitiesColumns(options: {
    onEditCorrect: (row: UploadExceptionActivityRow) => void;
}): ColumnDef<UploadExceptionActivityRow>[] {
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
            header: "Errors / Notes",
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
        {
            id: "actions",
            header: () => <div>Actions</div>,
            cell: ({ row }) => (
                <div className="flex gap-1">
                    <Button
                        variant="warning"
                        size="xs"
                        onClick={() => options.onEditCorrect(row.original)}
                    >
                        Edit / Correct
                    </Button>
                </div>
            ),
        },
    ];
}
