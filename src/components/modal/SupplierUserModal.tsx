import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Spinner from "@/components/ui/spinner/Spinner";
import SupplierUserFormFields from "@/pages/SystemConfigurations/SupplierUsers/SupplierUserFormFields";
import { IUserCreate, UserCreateSchema } from "@/types/UserSchema";
import { upsertUser } from "@/database/user_api";
import { handleValidationErrors } from "@/helper/validationError";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onUserCreated?: (user: IUserCreate) => void;
};

export default function SupplierUserModal({ isOpen, onClose, onUserCreated }: Props) {
    const { handleSubmit, control, reset, setError } = useForm<IUserCreate>({
        defaultValues: {
            email: "",
            two_fa_enabled: false,
            two_fa_type: 0,
            user_type_id: 4,
            user_profile_id: 7,
            contact: {
                salutation: "",
                firstname: "",
                lastname: "",
                phone: "",
                mobile: "+44",
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "United Kingdom",
                postcode: "",
                organisation: "",
            },
        },
        resolver: zodResolver(UserCreateSchema),
    });

    const [isLoading, setIsLoading] = useState(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                    onClose();
                    reset();
            }}
            className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
        >
            <div className="px-4 py-2">
                <h3 className="text-lg font-semibold mb-4">Add Supplier User</h3>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-supplier-user-modal"
                        onSubmit={handleSubmit((data: IUserCreate) => {
                            setIsLoading(true);
                            toast.promise(upsertUser(data), {
                                loading: "Creating user...",
                                success: (response) => {
                                    setTimeout(() => {
                                        reset();
                                        onClose();
                                        setIsLoading(false);
                                        if (onUserCreated) onUserCreated(response as IUserCreate);
                                    }, 2000);
                                    return "User created successfully!";
                                },
                                error: (error: unknown) => {
                                    setIsLoading(false);
                                    return handleValidationErrors(error, setError);
                                },
                            });
                        })}
                    >
                        <SupplierUserFormFields control={control} />

                    <div className="mt-4 flex justify-end gap-3">
                        <Button
                            variant="danger"
                            onClick={() => {
                                onClose();
                                reset();
                            }}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" form="form-supplier-user-modal" disabled={isLoading}>
                            Create User
                        </Button>
                    </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
