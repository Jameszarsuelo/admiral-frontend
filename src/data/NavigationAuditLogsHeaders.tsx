import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { NavigationAuditLogRow } from "@/database/navigation_audit_logs_api";

export type NavigationAuditLogsRow = NavigationAuditLogRow;

export function getNavigationAuditLogsColumns(): ColumnDef<NavigationAuditLogsRow>[] {
    return [
        {
            accessorKey: "created_at",
            header: "Date / Time",
            cell: ({ row }) => (
                <div>{String(row.getValue("created_at") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "user_name",
            header: "User",
            cell: ({ row }) => <div>{String(row.getValue("user_name") ?? "-")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => <div>{String(row.getValue("role") ?? "-")}</div>,
        },
        {
            accessorKey: "page",
            header: "Page",
            cell: ({ row }) => {
                const page = String(row.getValue("page") ?? "-");
                const uri = String(row.original.uri ?? "");
                let target = page;

                if (uri) {
                    try {
                        const parsedUri = uri.startsWith("http://") || uri.startsWith("https://")
                            ? new URL(uri)
                            : new URL(uri, window.location.origin);
                        target = `${parsedUri.pathname}${parsedUri.search}`;
                    } catch {
                        target = uri.startsWith("/") ? uri : page;
                    }
                }

                return page !== "-" ? (
                    <Link
                        to={target}
                        className="font-medium text-brand-600 hover:underline dark:text-brand-400"
                    >
                        {page}
                    </Link>
                ) : (
                    <div>{page}</div>
                );
            },
        },
        {
            accessorKey: "method",
            header: "Method",
            cell: ({ row }) => <div>{String(row.getValue("method") ?? "-")}</div>,
        },
        {
            accessorKey: "uri",
            header: "URI",
            cell: ({ row }) => <div className="break-all">{String(row.getValue("uri") ?? "-")}</div>,
        },
        {
            accessorKey: "allowed",
            header: "Allowed",
            cell: ({ row }) => {
                const allowed = Boolean(row.getValue("allowed"));

                return (
                    <Badge variant={allowed ? "secondary" : "destructive"}>
                        {allowed ? "Allowed" : "Denied Access"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "ip_address",
            header: "IP Address",
            cell: ({ row }) => (
                <div>{String(row.getValue("ip_address") ?? "-")}</div>
            ),
        },
        {
            accessorKey: "user_agent",
            header: "User Agent",
            cell: ({ row }) => {
                const value = String(row.getValue("user_agent") ?? "-");

                return (
                    <div className="max-w-[520px] truncate" title={value}>
                        {value}
                    </div>
                );
            },
        },
    ];
}