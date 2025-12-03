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
import { IModuleActionForm } from "@/types/ModuleActionSchema";
import {
    fetchModuleActionById,
    upsertModuleAction,
} from "@/database/module_actions_api";
import { useQuery } from "@tanstack/react-query";
import { fetchModuleList } from "@/database/module_api";
import { IModuleBase } from "@/types/ModuleSchema";
import Combobox from "@/components/form/Combobox";
import { Field } from "@/components/ui/field";

export default function ModuleActionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset } = useForm<IModuleActionForm>({
        defaultValues: {
            id: undefined,
            action: "",
            code: "",
            module_id: undefined,
        },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchModuleActionById(id)
                .then((res) => reset(res as IModuleActionForm))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id, reset]);

    const { data: moduleOptions = [] } = useQuery<
        IModuleBase[],
        unknown,
        { value: number; label: string }[]
    >({
        queryKey: ["modules-list"],
        queryFn: fetchModuleList,
        select: (modules) =>
            (modules ?? []).map((m) => ({
                value: Number(m.id),
                label: m.name,
            })),
        placeholderData: [],
        staleTime: 1000 * 60 * 5,
    });

    async function onSubmit(data: IModuleActionForm) {
        try {
            setIsLoading(true);
            await toast.promise(upsertModuleAction(data), {
                loading: id ? "Updating Action..." : "Creating Action...",
                success: () => {
                    setTimeout(() => navigate("/module-actions"), 800);
                    return id ? "Action updated" : "Action created";
                },
                error: (e: unknown) =>
                    e instanceof Error ? e.message : "An error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Module Action" : "Add Module Action"}
                pageBreadcrumbs={[{ title: "Module Actions", link: "/module-actions" }]}
            />
            <ComponentCard
                title={id ? "Edit Module Action" : "Add Module Action"}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-module-action"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="action"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="action">
                                                Action
                                            </Label>
                                            <Input
                                                {...field}
                                                id="action"
                                                placeholder="Enter action name"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="code"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="code">Code</Label>
                                            <Input
                                                {...field}
                                                id="code"
                                                placeholder="Unique code"
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="module_id"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState?.invalid}
                                        >
                                            <Label htmlFor="module_id">
                                                Module
                                            </Label>
                                            <Combobox
                                                value={field.value ?? undefined}
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
                                            {fieldState?.error && (
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
                        <Button type="submit" form="form-module-action">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
