import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

export interface OverviewQueuedRow {
    bordereau_id: number;
    upload_batch_number?: number | null;
    supplier_id: number;
    import_date: string;
    department: string;
    supplier: string;
    work_type: string;
    bdx_type: string;
    bordereau_name: string;
    bordereau_status_id?: number;
    bordereau_status: string;
    is_paused?: boolean;
    can_delete?: boolean;
    is_completed: boolean;
}

export function getOverviewQueuedColumns(options: {
    onProcessNext: (bordereauId: number) => void;
    processNextPendingBordereauId?: number | null;
    onTogglePause: (bordereauId: number, nextPaused: boolean) => void;
    pausePendingBordereauId?: number | null;
    onExport: (bordereauId: number) => void;
    exportPendingBordereauId?: number | null;
    onAbort: (bordereauId: number) => void;
    abortPendingBordereauId?: number | null;
    onRequestDelete: (row: OverviewQueuedRow) => void;
    deletePendingBordereauId?: number | null;
}): ColumnDef<OverviewQueuedRow>[] {
    return [
    {
        accessorKey: "import_date",
        header: "Import Date",
        cell: ({ row }) => (
            <div>{String(row.getValue("import_date") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <div>{String(row.getValue("department") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "supplier",
        header: "Supplier",
        cell: ({ row }) => <div>{String(row.getValue("supplier") ?? "-")}</div>,
    },
    {
        accessorKey: "work_type",
        header: "Work Type",
        cell: ({ row }) => (
            <div>{String(row.getValue("work_type") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "bdx_type",
        header: "BDX Type",
        cell: ({ row }) => <div>{String(row.getValue("bdx_type") ?? "-")}</div>,
    },
    {
        accessorKey: "bordereau_name",
        header: "Bordereau Name",
        cell: ({ row }) => (
            <div>{String(row.getValue("bordereau_name") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "bordereau_status",
        header: "Bordereau Status",
        cell: ({ row }) => (
            <Badge variant="secondary">
                <BadgeCheckIcon className="mr-1 inline-block" />
                {String(row.getValue("bordereau_status") ?? "-")}
            </Badge>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const bordereauId = row.original.bordereau_id;
            const canDelete = Boolean(row.original.can_delete);
            const deletePending = options.deletePendingBordereauId === bordereauId;
            const abortPending = options.abortPendingBordereauId === bordereauId;
            const exportPending = options.exportPendingBordereauId === bordereauId;

            return (
                <div className="flex gap-1">
                    <Button
                        variant="primary"
                        size="xs"
                        onClick={() => {
                            const uploadBatchNumber =
                                row.original.upload_batch_number ?? null;

                            const targetUrl =
                                uploadBatchNumber != null
                                    ? `/overview/queue-batch/${uploadBatchNumber}`
                                    : `/bordereau-detail/view/${bordereauId}`;
                            window.open(
                                targetUrl,
                                "_blank",
                                "noopener,noreferrer,width=1200,height=900",
                            );
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="warning"
                        size="xs"
                        onClick={() => options.onProcessNext(bordereauId)}
                        disabled={
                            row.original.is_completed ||
                            options.processNextPendingBordereauId === bordereauId
                        }
                    >
                        Process Next
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => options.onExport(bordereauId)}
                        disabled={exportPending}
                    >
                        {exportPending ? "Exporting..." : "Export"}
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => options.onAbort(bordereauId)}
                        disabled={row.original.is_completed || abortPending}
                    >
                        {abortPending ? "Aborting..." : "Abort"}
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        onClick={() => options.onRequestDelete(row.original)}
                        disabled={row.original.is_completed || !canDelete || deletePending}
                    >
                        {deletePending ? "Deleting..." : "Delete"}
                    </Button>
                    <Button
                        variant={row.original.is_paused ? "success" : "outline"}
                        size="xs"
                        onClick={() =>
                            options.onTogglePause(
                                bordereauId,
                                !row.original.is_paused,
                            )
                        }
                        disabled={
                            row.original.is_completed ||
                            options.pausePendingBordereauId === bordereauId
                        }
                    >
                        {row.original.is_paused ? "Unpause" : "Pause"}
                    </Button>
                </div>
            );
        },
    },
    ];
}
