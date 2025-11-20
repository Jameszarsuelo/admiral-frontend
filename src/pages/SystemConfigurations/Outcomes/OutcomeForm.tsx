import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import Radio from "@/components/form/input/Radio";
import { useEffect } from "react";
import { fetchOutcome, upsertOutcome } from "@/database/outcome_api";
import { handleValidationErrors } from "@/helper/validationError";
import { IOutcomeForm, OutcomeSchema } from "@/types/OutcomeSchema";

export default function OutcomeForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<IOutcomeForm>({
        defaultValues: {
            status: false,
            outcome_code: "",
            classification: "",
            queue: "",
            description: ""
        },
        resolver: zodResolver(OutcomeSchema)
    });

    useEffect(() => {
        if (id) {
            fetchOutcome(id).then((data) => {
                console.log("Fetched outcome data:", data);
                reset({
                    status: data.status || false,
                    outcome_code: data.outcome_code || "",
                    classification: data.classification || "",
                    queue: data.queue || "",
                    description: data.description || "",
                })
            })
        }
    }, [id, reset]);


    const onSubmit = async (outcomeData: IOutcomeForm) => {
        try {
            // console.log(id ? true : false);
            const payload = id ? { ...outcomeData, id: Number(id) } : outcomeData;
            toast.promise(
                upsertOutcome(payload), {
                loading: id ? "Updating Outcome..." : "Creating Outcome...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/outcomes`)
                    }, 2000);
                    return id ? "Outcome updated successfully" : "Outcome created successfully!";
                },
                error: (error: unknown) => {
                    return handleValidationErrors(error, setError)
                }
            }
            )
        } catch (error) {
            console.log("Error upon Submitting", error);
        }
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Outcome" />
            <ComponentCard title={id ? "Edit Outcome" : "Add Outcome"}>
                <form id="form-outcome" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid">
                                            <Label>Status</Label>
                                            <div className="flex gap-8">
                                                <Radio
                                                    id="status_no"
                                                    value={0}
                                                    checked={!field.value}
                                                    onChange={() => field.onChange(false)}
                                                    label="NO" name={""} />
                                                <Radio
                                                    id="status_yes"
                                                    value={1}
                                                    checked={field.value ? true : false}
                                                    onChange={() => field.onChange(true)}
                                                    label="YES" name={""} />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="outcome_code"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Outcome Code
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="outcome_code"
                                                placeholder="Enter Outcome Code"
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

                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="classification"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Classification
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="classification"
                                                placeholder="Enter Classification"
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
                                    name="queue"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Queue
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="queue"
                                                placeholder="Enter Queue"
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
                        <div className="grid grid-cols-1 gap-6 ">
                            <div>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Description
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="description"
                                                placeholder="Enter Description"
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
                    <Button variant="danger" onClick={() => navigate("/outcomes")}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-outcome">
                        Submit
                    </Button>
                </div>
            </ComponentCard>
        </>
    );
}
