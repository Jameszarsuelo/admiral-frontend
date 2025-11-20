import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import Combobox from "@/components/form/Combobox";
import { Field } from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import { fetchProfileById, upsertProfile } from "@/database/profile_api";
import { IProfileForm } from "@/types/ProfileSchema";
import { fetchRoleOptions } from "@/database/roles_api";
import { handleValidationErrors } from "@/helper/validationError";

export default function ProfileForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset, setError } = useForm<IProfileForm>({
        defaultValues: { id: undefined, role_id: 0, name: "" },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchProfileById(id)
                .then((res) => {
                    reset({ id: res.id, role_id: res.role_id, name: res.name });
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id, reset]);

    const { data: roleOptionsData } = useQuery({
        queryKey: ["role-options"],
        queryFn: async () => {
            return await fetchRoleOptions();
        },
        staleTime: 1000 * 60 * 5,
    });

    const roleOptions = (roleOptionsData ?? []).map((r) => ({
        value: Number(r.value),
        label: r.label,
    }));

    async function onSubmit(data: IProfileForm) {
        try {
            setIsLoading(true);
            await toast.promise(upsertProfile(data), {
                loading: id ? "Updating Profile..." : "Creating Profile...",
                success: () => {
                    setTimeout(() => navigate("/profiles"), 800);
                    return id ? "Profile updated" : "Profile created";
                },
                error: (error: unknown) => {
                    return handleValidationErrors(error, setError);
                },
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Profile" />
            <ComponentCard title={id ? "Edit Profile" : "Add Profile"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-profile" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState?.invalid}>
                                        <Label htmlFor="name">Name</Label>
                                        <Input
                                            {...field}
                                            id="name"
                                            placeholder="Enter profile name"
                                        />
                                        {fieldState?.error && (
                                            <p className="mt-1 text-sm text-error-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="role_id"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState?.invalid}>
                                        <Label htmlFor="role_id">Role</Label>
                                        <Combobox
                                            value={field.value ?? undefined}
                                            options={roleOptions}
                                            onChange={(v) =>
                                                field.onChange(Number(v))
                                            }
                                            placeholder="Select Role"
                                            searchPlaceholder="Search role..."
                                            emptyText="No role found."
                                        />
                                        {fieldState?.error && (
                                            <p className="mt-1 text-sm text-error-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />
                        </div>
                    </form>
                )}

                {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="form-profile">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
