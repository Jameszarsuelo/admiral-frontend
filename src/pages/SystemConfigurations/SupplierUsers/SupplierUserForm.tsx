import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import SupplierUserFormFields from "./SupplierUserFormFields";
import { zodResolver } from "@hookform/resolvers/zod";
import { handleValidationErrors } from "@/helper/validationError";
import Spinner from "@/components/ui/spinner/Spinner";
import { IUserCreate, UserCreateSchema } from "@/types/UserSchema";
import {
    fetchUserById,
    upsertUser,
} from "@/database/user_api";

const SupplierUserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchUserById(id)
                .then((data) => {
                    const userData = data as IUserCreate;
                    reset(userData);
                })
                .catch((error) => {
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError]);

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    const onSubmit = async (userData: IUserCreate) => {
        console.log("Submitted Data:", userData);
        try {
            toast.promise(upsertUser(userData), {
                loading: id ? "Updating User..." : "Creating User...",
                success: () => {
                    setTimeout(() => {
                        navigate(-1);
                    }, 2000);
                    return id ? "User updated successfully" : "User created successfully!";
                },
                error: (error: unknown) => {
                    return handleValidationErrors(error, setError);
                },
            });
        } catch (error) {
            console.log("Error upon Submitting", error);
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Supplier User" />
            <ComponentCard title={id ? "Edit Supplier User" : "Add Supplier User"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-supplier-user" onSubmit={handleSubmit(onSubmit, onError)}>
                        <SupplierUserFormFields control={control} />
                    </form>
                )}

                {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        {!id && (
                            <Button variant="outline" onClick={() => reset()}>
                                Reset
                            </Button>
                        )}

                        <Button type="submit" form="form-supplier-user">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
};

export default SupplierUserForm;
