import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button/Button";
import { IBordereauIndex } from "@/types/BordereauSchema";
import { BadgeCheckIcon } from "lucide-react";
import Can from "@/components/auth/Can";

export const getBordeareauHeaders = (
): ColumnDef<IBordereauIndex>[] => [
    {
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: "Platform ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "supplier",
        accessorFn: (row) => row.supplier?.name,
        header: "Supplier Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("supplier")}</div>
        ),
    },
    {
        accessorKey: "bordeareau_name",
        header: "Boredereau",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("bordeareau_name")}</div>
        ),
    },
    {
        accessorKey: "comment",
        accessorFn: (row) => {
            const lastComment = row.comments?.slice(-1)[0]?.comment;

            const limit = 30;
            const truncated =
                lastComment && lastComment.length > limit
                    ? lastComment.slice(0, limit) + "..."
                    : lastComment;
            return truncated;
        },
        header: "Comments",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("comment")}</div>
        ),
    },
    {
        accessorKey: "claim_number",
        header: "Claim Number",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("claim_number")}</div>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "status",
        accessorFn: (row) => row.bordereau_status.status,
        header: "Status",
        cell: ({ row }) => (
            <Badge variant="secondary">
                <BadgeCheckIcon className="mr-1 inline-block" />
                {row.getValue("status")}
            </Badge>
        ),
    },
    {
        accessorKey: "target_payment_date",
        header: "Target Porcess by",
        cell: ({ row }) => (
            <div className="capitalize">
                {row.getValue("target_payment_date")}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const id = row.original.id;
            return (
                <div className="flex gap-1">
                    <Can permission="bordereau_detail.view">
                        <Button
                            variant="primary"
                            size="xs"
                            data-action="view"
                            data-id={String(id)}
                        >
                            View
                        </Button>
                    </Can>
                    <Button
                        variant="warning"
                        size="xs"
                        data-action="assign"
                        data-id={String(id)}
                    >
                        Assign
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        data-action="process"
                        data-id={String(id)}
                    >
                        Process Now
                    </Button>
                    <Button
                        variant="danger"
                        size="xs"
                        data-action="close"
                        data-id={String(id)}
                    >
                        Close
                    </Button>
                </div>
            );
        },
    },
];
