import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";

export interface UploadExceptionsRow {
    bordereau_id: number;
    upload_batch_number: number;
    supplier_id: number;
    bordereau_name: string;
    supplier: string;
    uploaded_by: string;
    uploaded_on: string;
    ideal_process: string;
    deadline: string;
    is_paused: boolean;
    can_delete: boolean;
}

export function getUploadExceptionsColumns(options: {
    onEditCorrect: (row: UploadExceptionsRow) => void;
    onRequestRemove: (row: UploadExceptionsRow) => void;
    removePendingBordereauId?: number | null;
}): ColumnDef<UploadExceptionsRow>[] {
    return [
        {
            accessorKey: "bordereau_name",
            header: "Bordereau Name",
            cell: ({ row }) => (
                <div>{String(row.getValue("bordereau_name") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "supplier",
            header: "Supplier",
            cell: ({ row }) => <div>{String(row.getValue("supplier") ?? "-")}</div>,
        },
        {
            accessorKey: "uploaded_by",
            header: "Uploaded by",
            cell: ({ row }) => (
                <div>{String(row.getValue("uploaded_by") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "uploaded_on",
            header: "Uploaded On",
            cell: ({ row }) => (
                <div>{String(row.getValue("uploaded_on") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "ideal_process",
            header: "Ideal Process",
            cell: ({ row }) => (
                <div>{String(row.getValue("ideal_process") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "deadline",
            header: "Deadline",
            cell: ({ row }) => <div>{String(row.getValue("deadline") ?? "-")}</div>,
        },
        {
            id: "actions",
            header: () => <div>Actions</div>,
            cell: ({ row }) => {
                const original = row.original;
                const removePending =
                    options.removePendingBordereauId === original.bordereau_id;

                return (
                    <div className="flex gap-1">
                        <Button
                            variant="warning"
                            size="xs"
                            onClick={() => options.onEditCorrect(original)}
                        >
                            Edit / Correct
                        </Button>
                        <Button
                            variant="danger"
                            size="xs"
                            disabled={!original.can_delete || removePending}
                            onClick={() => options.onRequestRemove(original)}
                        >
                            {removePending ? "Removing..." : "Remove"}
                        </Button>
                    </div>
                );
            },
        },
    ];
}
