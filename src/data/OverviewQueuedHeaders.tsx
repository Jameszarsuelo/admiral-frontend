import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";

export interface OverviewQueuedRow {
    bordereau_id: number;
    supplier_id: number;
    import_date: string;
    department: string;
    supplier: string;
    work_type: string;
    bdx_type: string;
    bordereau_name: string;
    bordereau_status: string;
    is_completed: boolean;
}

export function getOverviewQueuedColumns(options: {
    onProcessNext: (bordereauId: number) => void;
    processNextPending?: boolean;
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
            <div>{String(row.getValue("bordereau_status") ?? "-")}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const bordereauId = row.original.bordereau_id;

            return (
                <div className="flex gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                            const params = new URLSearchParams({
                                search: row.original.bordereau_name,
                                supplier_id: String(row.original.supplier_id ?? ""),
                            });

                            const targetUrl = `/bordereau-detail?${params.toString()}`;
                            const opened = window.open(
                                targetUrl,
                                "_blank",
                                "noopener,noreferrer,width=1200,height=900",
                            );

                            if (!opened) {
                                window.location.href = targetUrl;
                            }
                        }}
                    >
                        View
                    </Button>
                    <Button
                        variant="warning"
                        size="sm"
                        onClick={() => options.onProcessNext(bordereauId)}
                        disabled={
                            options.processNextPending || row.original.is_completed
                        }
                    >
                        Process Next
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                        Pause
                    </Button>
                    <Button variant="danger" size="sm" disabled>
                        Delete
                    </Button>
                </div>
            );
        },
    },
    ];
}
