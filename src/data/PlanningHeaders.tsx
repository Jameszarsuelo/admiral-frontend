import Button from "@/components/ui/button/Button";
import { ColumnDef } from "@tanstack/react-table";
import { IPlanningHeaders } from "@/types/PlanningSchema";
import { Badge } from "@/components/ui/badge";


export const getPlanningHeaders = (
    navigate: (path: string) => void,
    handleDeleteClick: (id: number) => void,
    refetch: () => void,
): ColumnDef<IPlanningHeaders>[] => [
    {
        accessorKey: "forecast_horizon",
        accessorFn: (row) => row?.forecast_horizon,
        header: () => <div className="ml-4">Forecast Horizon</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("forecast_horizon")}
            </div>
        ),
    },
    {
        accessorKey: "start_time",
        accessorFn: (row) => row?.start_time,
        header: () => <div className="ml-4">Start Time</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("start_time")}
            </div>
        ),
    },
    {
        accessorKey: "end_time",
        accessorFn: (row) => row?.end_time,
        header: () => <div className="ml-4">End Time</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("end_time")}
            </div>
        ),
    },
    {
        accessorKey: "work_saturday",
        accessorFn: (row) => row?.work_saturday,
        header: () => <div className="ml-4">Work on Saturday</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("work_saturday")}
            </div>
        ),
    },
    {
        accessorKey: "work_sunday",
        accessorFn: (row) => row?.work_sunday,
        header: () => <div className="ml-4">Work on Sunday</div>,
        cell: ({ row }) => (
            <div className="capitalize dark:text-white ml-4">
                {row.getValue("work_sunday")}
            </div>
        ),
    },
     {
        accessorKey: "is_active",
        accessorFn: (row) => row?.is_active,
        header: () => <div className="ml-4">Is Active</div>,
        cell: ({ row }) => (
            <>
            <Badge color="success">
                {row.getValue("is_active") == 1 ? "Yes" : "-" }
            </Badge>
            </>
           
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const planningData = row.original;

            const handleEdit = (id: number) => {
                navigate(`/planning/edit/${id}`);
            };

            const onDelete = (id: number) => {
                handleDeleteClick(id);
                refetch();
            };

            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleEdit(planningData.id!)}
                        variant="primary"
                        size="sm"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => onDelete(planningData.id!)}
                        variant="danger"
                        size="sm"
                    >
                        Delete
                    </Button>
                </div>
            );
        },
    },
];
