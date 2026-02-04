import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import { Field } from "@/components/ui/field";
import { handleValidationErrors } from "@/helper/validationError";
import Checkbox from "@/components/form/input/Checkbox";
import {
    fetchBordereauProcessingQueueById,
    upsertBordereauProcessingQueue,
} from "@/database/bordereau_processing_queue_api";
import { IBordereauProcessingQueueForm } from "@/types/BordereauProcessingQueueSchema";

export default function BordereauProcessingQueueForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset, setError } = useForm<
        IBordereauProcessingQueueForm
    >({
        defaultValues: {
            id: undefined,
            deadline_queue_top: 24,
            target_queue_top: 12,
            queue_priority_multiplier: 3,
            queue_enforce_supplier_priority: true,
        },
    });

    useEffect(() => {
        if (!id) return;

        setIsLoading(true);
        fetchBordereauProcessingQueueById(id)
            .then((data) => {
                reset({
                    ...data,
                });
            })
            .catch((error) => handleValidationErrors(error, setError))
            .finally(() => setIsLoading(false));
    }, [id, reset, setError]);

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    async function onSubmit(data: IBordereauProcessingQueueForm) {
        toast.promise(upsertBordereauProcessingQueue(data), {
            loading: id ? "Updating configuration..." : "Creating configuration...",
            success: () => {
                setTimeout(() => {
                    navigate("/bordereau-processing-queue");
                }, 500);
                return id
                    ? "Configuration updated successfully!"
                    : "Configuration created successfully!";
            },
            error: (error: unknown) => handleValidationErrors(error, setError),
        });
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Bordereau Processing Queue" : "Add Bordereau Processing Queue"}
                pageBreadcrumbs={[
                    {
                        title: "Bordereau Processing Queue",
                        link: "/bordereau-processing-queue",
                    },
                ]}
            />

            <ComponentCard
                title={id ? "Edit Configuration" : "Add Configuration"}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-bordereau-processing-queue"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="deadline_queue_top"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="deadline_queue_top">
                                                Days to Deadline
                                            </Label>
                                            <Input
                                                id="deadline_queue_top"
                                                type="number"
                                                value={String(field.value ?? 0)}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                The number of working hours left before deadline.
                                            </p>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="target_queue_top"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="target_queue_top">
                                                Days to Ideal
                                            </Label>
                                            <Input
                                                id="target_queue_top"
                                                type="number"
                                                value={String(field.value ?? 0)}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                The number of working hours left before ideal.
                                            </p>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="queue_priority_multiplier"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="queue_priority_multiplier">
                                                Priority Multiplying Factor
                                            </Label>
                                            <Input
                                                id="queue_priority_multiplier"
                                                type="number"
                                                value={String(field.value ?? 0)}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                This is the speed by which Priority Suppliers will rise
                                                against normal suppliers.
                                            </p>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="flex items-center">
                                <Controller
                                    name="queue_enforce_supplier_priority"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="mt-6">
                                            <Checkbox
                                                checked={!!field.value}
                                                onChange={(checked) =>
                                                    field.onChange(checked)
                                                }
                                                label="Enforce Supplier Priority"
                                            />
                                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                If enabled, Priority Suppliers will always be processed
                                                ahead of normal suppliers.
                                            </p>
                                        </div>
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
                        <Button
                            type="submit"
                            form="form-bordereau-processing-queue"
                        >
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
