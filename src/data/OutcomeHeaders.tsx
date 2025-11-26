import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCheckIcon, BadgeXIcon } from "lucide-react";
import { IOutcomeHeaders } from "@/types/OutcomeSchema";
import { Badge } from "@/components/ui/badge";
import Can from "@/components/auth/Can";

export const getOutcomeHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IOutcomeHeaders>[] => [
    {
        accessorKey: "id",
        accessorFn: (row) => row.id,
        header: "Outcome ID",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("id")}</div>
        ),
    },
    {
        accessorKey: "outcome_code",
        accessorFn: (row) => row.outcome_code,
        header: "Terminal",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("outcome_code")}</div>
        ),
    },
    {
        accessorKey: "queue",
        accessorFn: (row) => row.queue,
        header: "Task",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("queue")}</div>
        ),
    },
    {
        accessorKey: "description",
        accessorFn: (row) => row.description,
        header: "Description",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("description")}</div>
        ),
    },
    {
        accessorKey: "status",
        accessorFn: (row) => row.status,
        header: "Status",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("status")}</div>
        ),
    },
    // {
    //     accessorKey: "status",
    //     accessorFn: (row) => row.status,
    //     header: "Status",
    //     cell: ({ row }) => (
    //         <Badge
    //             className={
    //                 row.getValue("status") == 1
    //                     ? "bg-success-500"
    //                     : "bg-error-500"
    //             }
    //         >
    //             {row.getValue("status") == 1 ? (
    //                 <BadgeCheckIcon className="mr-1 inline-block" />
    //             ) : (
    //                 <BadgeXIcon className="mr-1 inline-block" />
    //             )}
    //             {row.getValue("status") == 1 ? "Active" : "Inactive"}
    //         </Badge>
    //     ),
    // },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const outcomeData = row.original;

            const handleEdit = (id: number) => {
                navigate(`/outcomes/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Can permission="outcomes.view">
                        <Button
                            onClick={() => handleEdit(outcomeData.id!)}
                            variant="primary"
                            size="sm"
                        >
                            View
                        </Button>
                    </Can>
                    <Can permission="outcomes.delete">
                        <Button
                            onClick={() => onDelete(outcomeData.id!)}
                            variant="danger"
                            size="sm"
                        >
                            Delete
                        </Button>
                    </Can>
                </div>
            );
        },
    },
];
