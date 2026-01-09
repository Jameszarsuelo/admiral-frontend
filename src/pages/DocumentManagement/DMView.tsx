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
import SupplierDocumentsTable from "../SupplierDirectory/SupplierDocumentTable/SupplierDocumentsTable";
import Radio from "@/components/form/input/Radio";
import Label from "@/components/form/Label";
import { downloadSupplierDocument } from "@/database/supplier_api";
import { dateFormat } from "@/helper/dateFormat";

export default function DMView() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [selectedSearch, setSelectedSearch] = useState<string>("0");
    const {
        data: documents,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["document-list", selectedSearch],
        queryFn: async () => {
            // selectedSearch is "0" or "1" — pass boolean to API
            return await fetchDocumentList(selectedSearch === "1");
        },
        staleTime: 500,
    });

    const handleContactModal = (id: number) => {
        setSelectedId(id);
        setIsContactModalOpen((prev) => !prev);
    };

    const columns: ColumnDef<IDocumentSchema>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Document Name" },
        {
            accessorKey: "supplier",
            accessorFn: (row) => row.supplier?.name,
            header: () => <div className="ml-4">Supplier</div>,
            cell: ({ row }) => (
                <div className="capitalize dark:text-white ml-4">
                    {row.getValue("supplier")}
                </div>
            ),
        },
        { accessorKey: "revision", header: "Revision" },
        {
            accessorKey: "document_type",
            accessorFn: (row) => row.document_type.type,
            header: () => <div className="ml-4">Type</div>,
            cell: ({ row }) => (
                <div className="capitalize dark:text-white ml-4">
                    {row.getValue("document_type")}
                </div>
            ),
        },
        { accessorKey: "path", header: "Upload" },
        {
            accessorKey: "expiry_date",
            header: "Expiry",
            cell: ({ row }) => {
                const v = row.getValue("expiry_date") as unknown as string | null;
                return v ? <div className="ml-4">{dateFormat(v)}</div> : <div className="ml-4">-</div>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original as IDocumentSchema;
                const handleDownload = async (id: number) => {
                    const blob = await downloadSupplierDocument(id);
    
                    const url = window.URL.createObjectURL(blob);
                    const link = window.document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", row.getValue("name"));
                    window.document.body.appendChild(link);
                    link.click();
    
                    link.remove();
                    window.URL.revokeObjectURL(url);
                };
                const handleOpen = async (id: number) => {
                    const blob = await downloadSupplierDocument(id);

                    const url = window.URL.createObjectURL(blob);

                    window.open(
                        url,
                        "_blank",
                        "noopener,noreferrer,width=1000,height=800"
                    );
                };
                return (
                    <div className="flex items-center gap-2">
                        <Can permission="document_management.view">
                            <Button
                                onClick={() => handleOpen(item.id)}
                                variant="secondary"
                                size="sm"
                            >
                                View
                            </Button>
                        </Can>
                        <Can permission="document_management.edit">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate(
                                        `/document-management/edit/${item.id}`
                                    )
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
                        <Button
                            onClick={() => handleDownload(item.id!)}
                            variant="success"
                            size="sm"
                        >
                            Download
                        </Button>
                        <Can permission="document_management.view">
                            <Button
                                onClick={() => handleContactModal(item.id)}
                                variant="outline"
                                className="bg-[#00B0F0]! text-white!"
                                size="sm"
                            >
                                View Document
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
                                    onClick={() =>
                                        navigate(`/document-management/create`)
                                    }
                                >
                                    Add New Documents
                                </Button>
                            </Can>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="grid">
                            <div className="flex justify-center-safe gap-8">
                                <Label
                                    htmlFor="include_obsolete"
                                    className="font-bold text-md mb-0"
                                >
                                    Include Obsolete:
                                </Label>
                                <Radio
                                    id="obsolete_no"
                                    value="0"
                                    checked={selectedSearch === "0"}
                                    onChange={() => setSelectedSearch("0")}
                                    label="No"
                                    name="include_obsolete"
                                />

                                <Radio
                                    id="obsolete_yes"
                                    value="1"
                                    checked={selectedSearch === "1"}
                                    onChange={() => setSelectedSearch("1")}
                                    label="Yes"
                                    name="include_obsolete"
                                />
                            </div>
                        </div>
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
            <Modal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen((prev) => !prev)}
                className="w-auto! m-4"
            >
                <div className="relative w-full p-4 overflow-y-auto bg-white rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2">
                        {selectedId && (
                            <SupplierDocumentsTable supplierId={selectedId!} />
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}
