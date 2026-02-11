import Can from "@/components/auth/Can";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { FieldGroup, Field } from "@/components/ui/field";
import { fetchBordereauType, upsertBordereauType } from "@/database/bordereau_type_api";
import { handleValidationErrors } from "@/helper/validationError";
import { BordereauTypeSchema, IBordereauTypeForm } from "@/types/BordereauTypeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const BordereauTypeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<IBordereauTypeForm>({
        defaultValues: {
            bordereau_type: "",
        },
        resolver: zodResolver(BordereauTypeSchema),
    });

    useEffect(() => {
        if (id) {
            fetchBordereauType(id).then((data) => {
                reset({
                    bordereau_type: data.bordereau_type || "",
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || "",
                });
            });
        }
    }, [id, reset]);

    const onSubmit = async (formData: IBordereauTypeForm) => {
        try {
            const payload = id ? { ...formData, id: Number(id) } : formData;
            toast.promise(upsertBordereauType(payload), {
                loading: id ? "Updating Bordereau Type ..." : "Creating Bordereau Type ...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/bordereau-types`);
                    }, 2000);
                    return id
                        ? "Bordereau Type updated successfully"
                        : "Bordereau Type created successfully";
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
            <PageBreadcrumb
                pageTitle={id ? "Edit Bordereau Type" : "Add Bordereau Type"}
                pageBreadcrumbs={[{ title: "Bordereau Types", link: "/bordereau-types" }]}
            />
            <ComponentCard title={id ? "Edit Bordereau Type" : "Add Bordereau Type"}>
                <form id="form-bordereau-type" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 gap-1 mt-5">
                                <Controller
                                    name="bordereau_type"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="bordereau_type">
                                                Bordereau Type
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="bordereau_type"
                                                name="bordereau_type"
                                                placeholder="Enter Bordereau Type"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                    </FieldGroup>
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="danger" onClick={() => navigate("/bordereau-types")}>Cancel</Button>
                    <Button variant="outline" onClick={() => reset()}>Reset</Button>
                    <Can permission={id ? "bordereau_types.edit" : "bordereau_types.create"}>
                        <Button type="submit" form="form-bordereau-type">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    );
};

export default BordereauTypeForm;
