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
import { useEffect, useState } from "react";
import { IPlanningForm } from "@/types/planning";
import { PlanningFormSchema } from "@/schema/PlanningFormSchema";
import { fetchPlanning, upsertPlanning } from "@/database/planning_api";
import { handleValidationErrors } from "@/helper/validationError";


export function PlanningForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [canWorkSaturday, setCanWorkSaturday] = useState<string>("0");
    const [canWorkSunday, setCanWorkSunday] = useState<string>("0");
    const { handleSubmit, control, setError, reset} = useForm<IPlanningForm>({
        defaultValues: {
            start_time: "",
            end_time: "",
            work_saturday: "",
            work_sunday: "",
            forecast_horizon: ""
        },
        resolver:zodResolver(PlanningFormSchema)
    });

    useEffect(()=>{
        if(id){
            fetchPlanning(id).then((data)=>{
                reset(data);
                setCanWorkSaturday(data.work_saturday);
                setCanWorkSunday(data.work_sunday);
            })
        }
    }, [id])
    

    const handleWorkSaturday = (value: string) => {
        setCanWorkSaturday(value);
    };

    const handleWorkSunday = (value: string) => {
        setCanWorkSunday(value);
    };

    const onSubmit = async (planningData: IPlanningForm) => {
            try {
                toast.promise(
                    upsertPlanning(planningData), {
                    loading: id ? "Updating Planning..." : "Creating Planning...",
                    success: () => {
                        setTimeout(() => {
                            navigate(`/planning/${id}`)
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
            <PageBreadcrumb pageTitle="Supplier" />
            <ComponentCard title={id ? "Edit Supplier" : "Add Supplier"}>
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
                                                    id="tm"
                                                    name="tm"
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
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
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
                                                    id="tm"
                                                    name="tm"
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
                                <div className="grid">
                                    <Label htmlFor="work_saturday_no">
                                        Able to Work on Saturday
                                    </Label>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <Radio
                                            id="work_saturday_no"
                                            name="work_saturday"
                                            value="0"
                                            checked={
                                                canWorkSaturday === "0"
                                            }
                                            onChange={handleWorkSaturday}
                                            label="NO"
                                        />
                                        <Radio
                                            id="work_saturday_yes"
                                            name="work_saturday"
                                            value="1"
                                            checked={
                                                canWorkSaturday === "1"
                                            }
                                            onChange={handleWorkSaturday}
                                            label="YES"
                                        />
                                    </div>
                                </div>

                                <div className="grid">
                                    <Label htmlFor="work_sunday">
                                        Able to Work on Sunday
                                    </Label>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <Radio
                                            id="work_sunday_no"
                                            name="work_sunday"
                                            value="0"
                                            checked={
                                                canWorkSunday === "0"
                                            }
                                            onChange={handleWorkSunday}
                                            label="NO"
                                        />
                                        <Radio
                                            id="work_sunday_yes"
                                            name="work_sunday"
                                            value="1"
                                            checked={
                                                canWorkSunday === "1"
                                            }
                                            onChange={handleWorkSunday}
                                            label="YES"
                                        />
                                    </div>
                                </div>
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
