import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useState } from "react";
import { useNavigate } from "react-router";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
// import api from "@/database/api";
import { ColumnDef } from "@tanstack/react-table";
import { IDocumentSchema } from "@/types/DocumentSchema";
import { deleteDocument, fetchDocumentList } from "@/database/document_api";
import Can from "@/components/auth/Can";
import { Modal } from "@/components/ui/modal";

export default function DMView() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: documents,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["document-list"],
        queryFn: async () => {
            return await fetchDocumentList();
        },
        staleTime: 500,

    });

    console.log(documents);

    const columns: ColumnDef<IDocumentSchema>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Document Name" },
        { accessorKey: "revision", header: "Revision" },
        { accessorKey: "document_type_id", header: "Type" },
        { accessorKey: "path", header: "Upload" },
        { accessorKey: "expiry_date", header: "Expiry" },
        { accessorKey: "description", header: "Description" },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original as IDocumentSchema;
                return (
                    <div className="flex items-center gap-2">
                        <Can permission="document_management.edit">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate(`/document-management/edit/${item.id}`)
                                }
                            >
                                Edit
                            </Button>
                        </Can>

                        <Can permission="document_management.delete">
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

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId === null) return;
        setIsDeleting(true);
        try {
            await deleteDocument(selectedId);
            await refetch();
            setIsModalOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error("Error deleting IPC:", error);
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

    // const columns = getUserHeaders(navigate, handleDeleteClick, refetch);

    return (
        <>
            <PageBreadcrumb pageTitle="Document Management" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Document Management
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all document management and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Can permission="document_management.create">
                                <Button
                                    size="sm"
                                    onClick={() => navigate(`/document-management/create`)}
                                >
                                    Add New Documents
                                </Button>
                            </Can>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && documents ? (
                                <DataTable columns={columns} data={documents} />
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
                            Are you sure to delete this Document?
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
