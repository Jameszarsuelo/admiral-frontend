import Button from "@/components/ui/button/Button";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheckIcon } from "lucide-react";

export interface HeadcountRow {
    bordereau_processing_clerk: string;
    first_login: string;
    current_status: string;
    time_in_current_status: string;
    time_in_ready: string;
    time_in_paused: string;
    current_bordereau: string;
    activities_processed: number;
    bdx_aht: string;
}

export const headcountColumns: ColumnDef<HeadcountRow>[] = [
    {
        accessorKey: "bordereau_processing_clerk",
        header: "Bordereau Processing Clerk",
        cell: ({ row }) => (
            <div>{String(row.getValue("bordereau_processing_clerk") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "first_login",
        header: "First Login",
        cell: ({ row }) => <div>{String(row.getValue("first_login") ?? "-")}</div>,
    },
    {
        accessorKey: "current_status",
        header: "Current Status",
        cell: ({ row }) => {
            const raw = row.getValue("current_status");
            const status = String(raw ?? "-");
            const normalized = status.trim().toLowerCase();

            const className =
                normalized === "ready"
                    ? "bg-success-500 text-white border-transparent"
                    : normalized === "processing" || normalized === "wrap up"
                      ? "bg-blue-light-500 text-white border-transparent"
                      : normalized === "break" ||
                          normalized === "training" ||
                          normalized === "lunch"
                        ? "bg-warning-500 text-white border-transparent"
                        : normalized === "log off" || normalized === "logged off"
                          ? "bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-white/80 dark:border-gray-800"
                          : "bg-gray-500 text-white border-transparent";

            return (
                <Badge variant="secondary" className={className}>
                    <BadgeCheckIcon className="mr-1 inline-block" />
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "time_in_current_status",
        header: "Time in Current Status",
        cell: ({ row }) => (
            <div>{String(row.getValue("time_in_current_status") ?? "-")}</div>
        ),
    },
    {
        accessorKey: "time_in_ready",
        header: "Time in Ready",
        cell: ({ row }) => <div>{String(row.getValue("time_in_ready") ?? "-")}</div>,
    },
    {
        accessorKey: "time_in_paused",
        header: "Time in Paused",
        cell: ({ row }) => <div>{String(row.getValue("time_in_paused") ?? "-")}</div>,
    },
    {
        accessorKey: "current_bordereau",
        header: "Current Bordereau",
        cell: ({ row }) => <div>{String(row.getValue("current_bordereau") ?? "-")}</div>,
    },
    {
        accessorKey: "activities_processed",
        header: "Activities Processed",
        cell: ({ row }) => (
            <div>{String(row.getValue("activities_processed") ?? 0)}</div>
        ),
    },
    {
        accessorKey: "bdx_aht",
        header: "BDX AHT",
        cell: ({ row }) => <div>{String(row.getValue("bdx_aht") ?? "-")}</div>,
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        enableSorting: false,
        cell: () => (
            <Button size="sm" variant="outline" disabled>
                Export Detail
            </Button>
        ),
    },
];
