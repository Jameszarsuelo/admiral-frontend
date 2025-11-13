import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { upsertSupplier } from "@/database/supplier_api";
import { handleValidationErrors } from "@/helper/validationError";
import DocumentFields, {
    DocumentVisibilityOption,
} from "@/components/form/document/DocumentFields";
import { DocumentCreateSchema } from "@/types/DocumentSchema";

type DocumentFormData = z.infer<typeof DocumentCreateSchema>;

interface DocumentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    supplierId: number;
    documentVisibilityOptions: DocumentVisibilityOption[];
    onDocumentCreated?: () => void;
}

export default function DocumentFormModal({
    isOpen,
    onClose,
    supplierId,
    documentVisibilityOptions,
    onDocumentCreated,
}: DocumentFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const { handleSubmit, control, reset, setError } =
        useForm<DocumentFormData>({
            defaultValues: {
                name: "",
                revision: "",
                expiry_date: "",
                document_visibility_id: 1,
                uploaded_by: user?.id || 0,
            },
            resolver: zodResolver(DocumentCreateSchema),
        });

    function onSubmit(data: DocumentFormData) {
        setIsLoading(true);

        // Wrap document in supplier payload for API
        const payload = {
            id: supplierId,
            document: data,
            updated_by: user?.id,
        };

        toast.promise(
            upsertSupplier(payload as unknown as Parameters<typeof upsertSupplier>[0]),
            {
            loading: "Uploading Document...",
            success: () => {
                setTimeout(() => {
                    if (onDocumentCreated) {
                        reset();
                        onClose();
                        setIsLoading(false);
                        onDocumentCreated();
                    }
                }, 2000);
                return "Document uploaded successfully!";
            },
            error: (error: unknown) => {
                setIsLoading(false);
                return handleValidationErrors(error, setError);
            },
        });
    }

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
            <div className="px-4 py-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Add Supplier Document
                </h2>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-document-modal"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DocumentFields
                                control={control}
                                documentVisibilityOptions={
                                    documentVisibilityOptions
                                }
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" form="form-document-modal">
                                Upload Document
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
