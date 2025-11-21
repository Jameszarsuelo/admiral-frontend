import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { getOutcomeHeaders } from "@/data/OutcomeHeaders";
import { useQuery } from "@tanstack/react-query";
import { fetchOutcomeList, deleteOutcome } from "@/database/outcome_api";
import Spinner from "@/components/ui/spinner/Spinner";
import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Can from "@/components/auth/Can";

export default function UserIndex() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: outcomeData,
        isLoading,
        // error,
        refetch,
    } = useQuery({
        queryKey: ["outcome-data"],
        queryFn: async () => {
            const response = await fetchOutcomeList();
            return response ?? [];
            // return await fetchOutcomeList();
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
            await deleteOutcome(selectedId);
            await refetch();
            setIsModalOpen(false);
            setSelectedId(null);
        } catch (error) {
            console.error("Error deleting Outcome:", error);
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

    const columns = getOutcomeHeaders(navigate, handleDeleteClick, refetch);

    return (
        <>
            <PageBreadcrumb pageTitle="Outcome" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Outcome
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all Outcome and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Can permission="outcome.create">
                                    <Button size="sm" onClick={() => navigate("/outcomes/create")}>
                                    Add New Outcome
                                </Button>
                            </Can>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && outcomeData ? (
                                <DataTable columns={columns} data={outcomeData} />
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
                            Are you sure to delete this Outcome?
                        </p>
                        <Button size="sm" variant="danger" 
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
