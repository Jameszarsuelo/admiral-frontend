import { IReasonForm } from "@/types/ReasonSchema";
import { ColumnDef } from "@tanstack/react-table";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";

export const getReasonHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,

): ColumnDef<IReasonForm>[] => [
        {
            accessorKey: "id",
            accessorFn: (row) => row.id,
            header: "Reason ID",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("id")}</div>
            ),
        },
        {
            accessorKey: "reason",
            accessorFn: (row) => row.reason,
            header: "Reason",
            cell: ({ row }) => (
                <div className="capitalize">{row.getValue("reason")}</div>
            ),
        },
        {
            accessorKey: "reason_for",
            accessorFn: (row) => row.reason_for,
            header: "Reason For",
            cell: ({ row }) => {
                const labels: Record<"1" | "2" | "3", string> = {
                    "1": "Process Now",
                    "2": "Close",
                    "3": "Outcome",
                };

                return (
                    <div className="capitalize">
                        {labels[row.getValue("reason_for") as "1" | "2" | "3"]}
                    </div>
                );
            }
        },
        {
            id: "actions",
            header: () => <div>Actions</div>,
            cell: ({ row }) => {
                const reasonData = row.original;

                const handleEdit = (id: number) => {
                    navigate(`/reason/edit/${id}`);
                };

                const onDelete = (id: number) => {
                    handleDeleteClick(id);
                    refetch();
                };

                return (
                    <div className="flex gap-2">
                        <Can permission="reason.view">
                            <Button
                                onClick={() => handleEdit(reasonData.id!)}
                                variant="primary"
                                size="sm"
                            >
                                View
                            </Button>
                        </Can>
                        <Can permission="reason.delete">
                            <Button
                                onClick={() => onDelete(reasonData.id!)}
                                variant="danger"
                                size="sm"
                            >
                                Delete
                            </Button>
                        </Can>
                    </div>
                );
            },
        }
    ]