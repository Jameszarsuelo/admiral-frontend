import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import {
    ContactCreateSchema,
    IContactCreateSchema,
} from "@/types/ContactSchema";
import { upsertContact } from "@/database/contact_api";
import { handleValidationErrors } from "@/helper/validationError";
import ContactFormFields from "@/components/form/contact/ContactFormFields";

interface ContactFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactCreated?: (contact: IContactCreateSchema) => void;
}

export default function ContactFormModal({
    isOpen,
    onClose,
    onContactCreated,
}: ContactFormModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

    const { handleSubmit, control, reset, setError, formState } =
        useForm<IContactCreateSchema>({
            defaultValues: {
                id: undefined,
                salutation: "",
                firstname: "",
                lastname: "",
                phone: "",
                mobile: "+44",
                email: "",
                organisation: "",
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "United Kingdom",
                postcode: "",
                type: "1",
                created_by: user?.id,
            },
            resolver: zodResolver(ContactCreateSchema),
        });

    function onSubmit(data: IContactCreateSchema) {
        setIsLoading(true);
        toast.promise(upsertContact(data), {
            loading: "Creating Contact...",
            success: (response) => {
                setTimeout(() => {
                    if (onContactCreated) {
                        reset();
                        onClose();
                        setIsLoading(false);
                        onContactCreated(response);
                    }
                }, 2000);
                return "Contact created successfully!";
            },
            error: (error: unknown) => {
                setIsLoading(false);
                return handleValidationErrors(error, setError);
            },
        });
    }

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="max-w-5xl p-6 max-h-[90vh] overflow-y-auto"
        >
            <div className="px-4 py-2">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                    Add New Contact
                </h2>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-contact-modal"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <ContactFormFields
                            control={control}
                            errors={formState.errors}
                        />

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" form="form-contact-modal">
                                Create Contact
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
