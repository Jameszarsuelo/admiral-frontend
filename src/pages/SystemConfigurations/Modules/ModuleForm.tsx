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
import { IModuleForm } from "@/types/ModuleSchema";
import { handleValidationErrors } from "@/helper/validationError";
import {
    fetchModuleById,
    fetchModuleList,
    upsertModule,
} from "@/database/module_api";
import { Field } from "@/components/ui/field";
import { useQuery } from "@tanstack/react-query";
import Combobox from "@/components/form/Combobox";

export default function ModuleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset, setError } = useForm<IModuleForm>({
        defaultValues: {
            id: undefined,
            name: "",
            code: "",
            path: "",
            parent_id: undefined,
        },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchModuleById(id)
                .then((data) => {
                    const moduleData = data as IModuleForm;

                    reset({
                        ...moduleData,
                    });
                })
                .catch((error) => {
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError]);

    const { data: moduleOptions = [] } = useQuery({
        queryKey: ["modules-list"],
        queryFn: fetchModuleList,
        select: (modules) =>
            (modules ?? [])
                .filter((m) => m.parent_id === null)
                .map((m) => ({ value: Number(m.id), label: m.name })),
        placeholderData: [],
        staleTime: 1000 * 60 * 5,
    });

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    async function onSubmit(data: IModuleForm) {
        toast.promise(upsertModule(data), {
            loading: id ? "Updating Module..." : "Creating Module...",
            success: () => {
                setTimeout(() => {
                    navigate("/modules");
                }, 2000);
                return id
                    ? "Module updated successfully!"
                    : "Module created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Module" : "Add Module"}
                pageBreadcrumbs={[{ title: "Modules", link: "/modules" }]}
            />
            <ComponentCard title={id ? "Edit Module" : "Add Module"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-module"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                {...field}
                                                id="name"
                                                placeholder="Enter module name"
                                            />
                                        </Field>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="code"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="code">Code</Label>
                                            <Input
                                                {...field}
                                                id="code"
                                                placeholder="Unique code"
                                            />
                                        </Field>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="path"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="path">Path</Label>
                                            <Input
                                                {...field}
                                                id="path"
                                                placeholder="Route path e.g. /foo"
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
                            <div>
                                <Controller
                                    name="parent_id"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="parent_id">
                                                Parent Module
                                            </Label>
                                            <Combobox
                                                value={field.value!}
                                                options={moduleOptions}
                                                onChange={(value) =>
                                                    field.onChange(
                                                        Number(value)
                                                    )
                                                }
                                                placeholder="Select Parent Module"
                                                searchPlaceholder="Search module..."
                                                emptyText="No module found."
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
                    </form>
                )}

                {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="form-module">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
