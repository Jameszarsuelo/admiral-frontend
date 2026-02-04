import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
    deleteBordereauProcessingQueue,
    fetchBordereauProcessingQueueList,
} from "@/database/bordereau_processing_queue_api";
import { IBordereauProcessingQueueBase } from "@/types/BordereauProcessingQueueSchema";
import Can from "@/components/auth/Can";

export default function BordereauProcessingQueueView() {
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: configs,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["bordereau-processing-queue-list"],
        queryFn: async () => {
            return await fetchBordereauProcessingQueueList();
        },
        staleTime: 500,
    });

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId == null) return;
        setIsDeleting(true);
        try {
            await deleteBordereauProcessingQueue(selectedId);
            await refetch();
            setIsModalOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error(
                "Error deleting bordereau processing queue config:",
                error,
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseModal = () => {
        if (!isDeleting) {
            setIsModalOpen(false);
            setSelectedId(null);
        }
    };

    const columns: ColumnDef<IBordereauProcessingQueueBase>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "deadline_queue_top", header: "Days to Deadline" },
        { accessorKey: "target_queue_top", header: "Days to Ideal" },
        {
            accessorKey: "queue_priority_multiplier",
            header: "Priority Multiplying Factor",
        },
        {
            accessorKey: "queue_enforce_supplier_priority",
            header: "Enforce Supplier Priority",
            cell: ({ row }) =>
                row.original.queue_enforce_supplier_priority ? "Yes" : "No",
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original as IBordereauProcessingQueueBase;
                return (
                    <div className="flex items-center gap-2">
                        <Can permission="bordereau_processing_queue.edit">
                            <Button
                                size="sm"
                                onClick={() => navigate(`edit/${item.id}`)}
                            >
                                Edit
                            </Button>
                        </Can>

                        <Can permission="bordereau_processing_queue.delete">
                            <Button
                                size="sm"
                                variant="danger"
                                onClick={() => handleDeleteClick(item.id!)}
                            >
                                Delete
                            </Button>
                        </Can>
                    </div>
                );
            },
        },
    ];

    return (
        <>
            <PageBreadcrumb pageTitle="Bordereau Processing Queue" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Bordereau Processing Queue
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                Configure queue processing parameters.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Can permission="bordereau_processing_queue.create">
                                <Button
                                    size="sm"
                                    onClick={() => navigate("create")}
                                >
                                    Add New Configuration
                                </Button>
                            </Can>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[700px] xl:min-w-full px-2">
                            {!isLoading && configs ? (
                                <DataTable columns={columns} data={configs} />
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                className="w-lg m-4"
            >
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Delete Confirmation
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Are you sure you want to delete this configuration?
                        </p>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleConfirmDelete()}
                        >
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
