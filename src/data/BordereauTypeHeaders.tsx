import { IBordereauTypeForm } from "@/types/BordereauTypeSchema";
import { ColumnDef } from "@tanstack/react-table";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";

export const getBordereauTypeHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IBordereauTypeForm>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "bordereau_type",
        header: "Bordereau Type",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("bordereau_type")}</div>
        ),
    },
    {
        accessorKey: "created_at",
        header: "Created",
        cell: ({ row }) => <div>{String(row.getValue("created_at") ?? "-")}</div>,
    },
    {
        accessorKey: "updated_at",
        header: "Updated",
        cell: ({ row }) => <div>{String(row.getValue("updated_at") ?? "-")}</div>,
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const item = row.original;

            const handleEdit = (id: number) => {
                navigate(`/bordereau-types/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Can permission="bordereau_types.view">
                        <Button
                            onClick={() => handleEdit(item.id!)}
                            variant="primary"
                            size="sm"
                        >
                            View
                        </Button>
                    </Can>
                    <Can permission="bordereau_types.delete">
                        <Button
                            onClick={() => onDelete(item.id!)}
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
