import { IDepartmentForm } from "@/types/DepartmentSchema";
import { ColumnDef } from "@tanstack/react-table";
import Can from "@/components/auth/Can";
import Button from "@/components/ui/button/Button";

export const getDepartmentHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IDepartmentForm>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="capitalize">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "department",
        header: "Department",
        cell: ({ row }) => (
            <div className="capitalize">{row.getValue("department")}</div>
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
                navigate(`/departments/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Can permission="departments.view">
                        <Button
                            onClick={() => handleEdit(item.id!)}
                            variant="primary"
                            size="sm"
                        >
                            View
                        </Button>
                    </Can>
                    <Can permission="departments.delete">
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
