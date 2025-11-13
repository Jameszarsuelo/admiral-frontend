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
import { TimeIcon } from "@/icons";
import Radio from "@/components/form/input/Radio";
import { useEffect } from "react";
import { fetchPlanning, upsertPlanning } from "@/database/planning_api";
import { handleValidationErrors } from "@/helper/validationError";
import { IPlanningForm, PlanningFormSchema } from "@/types/PlanningSchema";


export default function PlanningForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<IPlanningForm>({
        defaultValues: {
            start_time: "",
            end_time: "",
            work_saturday: "0",
            work_sunday: "0",
            forecast_horizon: ""
        },
        resolver: zodResolver(PlanningFormSchema)
    });

    useEffect(() => {
        if (id) {
            fetchPlanning(id).then((data) => {
                console.log("Fetched planning data:", data);
                // reset(data);
                reset({
                    start_time: data.start_time || "",
                    end_time: data.end_time || "",
                    work_saturday: (Number(data.work_saturday) === 1 ? "1" : "0") as "0" | "1",
                    work_sunday: (Number(data.work_sunday) === 1 ? "1" : "0") as "0" | "1",
                    forecast_horizon: data.forecast_horizon || "",
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || ""
                })
            })
        }
    }, [id, reset]);


    const onSubmit = async (planningData: IPlanningForm) => {
        try {
            // console.log(id ? true : false);
            const payload = id ? { ...planningData, id: Number(id) } : planningData;
            toast.promise(
                upsertPlanning(payload), {
                loading: id ? "Updating Planning..." : "Creating Planning...",
                success: (data) => {
                    console.log(data)
                    const planningID = data.id;
                    setTimeout(() => {
                        navigate(`/planning/${planningID}`)
                    }, 2000);
                    return id ? "Planning updated successfully" : "Planning created successfully!";
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
            <PageBreadcrumb pageTitle="Planning" />
            <ComponentCard title={id ? "Edit Planning" : "Add Planning"}>
                <form id="form-planning" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 grid grid-cols-subgrid gap-6">
                                
                                <Controller
                                    name="start_time"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Working Hours ( Start - End )
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    id="start_time_input"
                                                    name="start_time_input"
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <TimeIcon className="size-6" />
                                                </span>
                                            </div>
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="end_time"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                &nbsp;
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    id="end_time_input"
                                                    name="end_time_input"
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <TimeIcon className="size-6" />
                                                </span>
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="col-span-4 grid grid-cols-subgrid gap-6 mt-5">
                                <Controller
                                    name="work_saturday"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid">
                                            <Label>Able to Work on Saturday</Label>
                                            <div className="flex gap-8">
                                                <Radio
                                                    id="work_saturday_no"
                                                    value={0}
                                                    checked={field.value == "0"}
                                                    onChange={() => field.onChange("0")}
                                                    label="NO" name={""} />
                                                <Radio
                                                    id="work_saturday_yes"
                                                    value={1}
                                                    checked={field.value == "1"}
                                                    onChange={() => field.onChange("1")}
                                                    label="YES" name={""} />
                                            </div>
                                        </div>
                                    )}
                                />

                                <Controller
                                    name="work_sunday"
                                    control={control}
                                    render={({ field }) => (
                                        <div className="grid">
                                            <Label>Able to Work on Sunday</Label>
                                            <div className="flex gap-8">
                                                <Radio
                                                    id="work_sunday_no"
                                                    value={0}
                                                    checked={field.value == "0"}
                                                    onChange={() => field.onChange("0")}
                                                    label="NO" name={""} />
                                                <Radio
                                                    id="work_sunday_yes"
                                                    value={1}
                                                    checked={field.value == "1"}
                                                    onChange={() => field.onChange("1")}
                                                    label="YES" name={""} />
                                            </div>
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="col-span-2 grid gap-6  mt-5">
                                <Controller
                                    name="forecast_horizon"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Forecast Horizon
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="forecast_horizon"
                                                placeholder="Enter Forecast Horizon"
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
                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-planning">
                        Submit
                    </Button>
                </div>
            </ComponentCard>
        </>
    );
}
