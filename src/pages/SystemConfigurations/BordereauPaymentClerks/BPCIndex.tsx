import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { deleteBpc, fetchBpcList } from "@/database/bpc_api";
import { getBPCHeaders } from "@/data/BPCHeaders";

export default function BPCIndex() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: bpcData,
        isLoading,
        // error,
        refetch,
    } = useQuery({
        queryKey: ["bpc-data"],
        queryFn: async () => {
            return await fetchBpcList();
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: true,
        staleTime: 500,
        gcTime: 20000,
    });

    const handleDeleteClick = (id: number) => {
        setSelectedId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (selectedId === null) return;

        setIsDeleting(true);
        try {
            await deleteBpc(selectedId);
            await refetch();
            setIsModalOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error("Error deleting BPC:", error);
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

    const columns = getBPCHeaders(navigate, handleDeleteClick, refetch);

    return (
        <>
            <PageBreadcrumb pageTitle="Bordereau Payment Clerk" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Bordereau Payment Clerks
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all bordereau payment clerks and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate("/bordereau-payment-clerk/create")
                                }
                            >
                                Add New BPC
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && bpcData ? (
                                <DataTable columns={columns} data={bpcData} />
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
                            Are you sure to delete this Bordereau Payment Clerk?
                        </p>
                        <Button size="sm" variant="danger" onClick={() => handleConfirmDelete()}>
                            {isDeleting ? "Deleting..." : "Confirm Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
