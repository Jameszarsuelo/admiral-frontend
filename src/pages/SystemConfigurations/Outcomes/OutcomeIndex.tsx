import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { getOutcomeHeaders } from "@/data/OutcomeHeaders";
import { useQuery } from "@tanstack/react-query";
import { fetchOutcomeList, deleteOutcome } from "@/database/outcome_api";
import Spinner from "@/components/ui/spinner/Spinner";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Can from "@/components/auth/Can";
import Select from "@/components/form/Select";
import Label from "@/components/form/Label";
import { Textarea } from "@/components/ui/textarea";
import { fetchReasonOptions } from "@/database/reason_api";

export default function UserIndex() {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [reasonForDeletion, setReasonForDeletion] = useState<string>("");
    const [descriptionForDeletion, setDescriptionForDeletion] = useState<string>("");
    const [deleteErrors, setDeleteErrors] = useState({reason: "", description: ""});
   const [reasonForDeletionOptions, setReasonForDeletionOptions] = useState<{ value: number; label: string }[]>([]);

    // Fetch options once when component mounts
    useEffect(() => {
        async function loadOptions() {
            try {
                const options = await fetchReasonOptions();
                setReasonForDeletionOptions(options);
            } catch (error) {
                console.error("Failed to load reason options", error);
            }
        }
        loadOptions();
    }, []);
    

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
        let errors = { reason: "", description: "" };
        let hasError = false;

        if (!reasonForDeletion.trim()) {
            errors.reason = "Reason is required";
            hasError = true;
        }

        if (!descriptionForDeletion.trim()) {
            errors.description = "Description is required";
            hasError = true;
        }

        setDeleteErrors(errors);

        if (hasError) return;

        if (selectedId === null) return;

        setIsDeleting(true);
        const payload = {id: selectedId, deleted_reason: reasonForDeletion, deleted_description: descriptionForDeletion }
        try {
            // await deleteOutcome(selectedId);
            await deleteOutcome(payload);
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
                            <Can permission="outcomes.create">
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
                    <div className="px-2">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Delete Confirmation
                        </h4>

                        <Label>Reason for Deletion</Label>
                        
                        <Select options={reasonForDeletionOptions}
                                onChange={(value) => setReasonForDeletion(value)}
                        ></Select>
                        {deleteErrors.reason && (
                            <p className="text-red-500 text-sm">{deleteErrors.reason}</p>
                        )}
                        
                        <Label className="mt-5">Description</Label>
                        {/* <TextArea 
                            name="description_for_deletion"
                            rows={5}
                            onChange={(value) => setDescriptionForDeletion(value)}/> */}
                        <Textarea name="description_for_deletion" onChange={(e) => setDescriptionForDeletion(e.target.value)}/>
                        {deleteErrors.description && (
                            <p className="text-red-500 text-sm">{deleteErrors.description}</p>
                        )}
                            
                        {/* <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Are you sure to delete this Outcome?
                        </p> */}

                        <Button className="mt-5" size="sm" variant="danger" 
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
