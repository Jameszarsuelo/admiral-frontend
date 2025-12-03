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
import { useEffect, useState } from "react";
import { bordereauStatuses, fetchOutcome, fetchShowOutcome, upsertOutcome } from "@/database/outcome_api";
import { handleValidationErrors } from "@/helper/validationError";
import { IOutcomeForm, OutcomeSchema } from "@/types/OutcomeSchema";
import Can from "@/components/auth/Can";
import Select from "@/components/form/Select";

export default function OutcomeView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statusesOptions, setStatusesOptions] = useState<{ value: number; label: string }[]>([]);


    const { handleSubmit, control, setError, reset } = useForm<IOutcomeForm>({
        defaultValues: {
            status: "",
            outcome_code: "",
            classification: "",
            queue: "",
            description: ""
        },
        resolver: zodResolver(OutcomeSchema)
    });

    useEffect(() => {
        async function fetchStatuses() {
            const bordereauOptionResult = await bordereauStatuses(); // fetch API
            setStatusesOptions(bordereauOptionResult);
        }
        fetchStatuses();

        if (id) {
            fetchShowOutcome(id).then((data) => {
                console.log("Fetched outcome data:", data);
                reset({
                    status: data.status || "",
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
            <ComponentCard title={"View Outcome"}>
                <form id="form-outcome" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>

                        <div className="grid grid-cols-2 gap-6 ">
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
                                             {String(field.value ?? "")}
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
                                             {String(field.value ?? "")}
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                               <Controller
                                        name="status"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="status">
                                                    Status
                                                </Label>
                                                {String(field.value ?? "")}
                                            </Field>
                                        )}
                                    />
                            </div>
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
                                             {String(field.value ?? "")}
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
                                            {String(field.value ?? "")}
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                    </FieldGroup>
                </form>
            </ComponentCard>
        </>
    );
}
