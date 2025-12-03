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
import Can from "@/components/auth/Can";

export default function PlanningForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset, watch } =
        useForm<IPlanningForm>({
            defaultValues: {
                start_time: "",
                end_time: "",
                work_saturday: "0",
                work_sunday: "0",
                is_active: false,
                forecast_horizon: "",
                active_hour: "",
            },
            resolver: zodResolver(PlanningFormSchema),
        });

    // Watch start & end time directly from form
    const startTime = watch("start_time");
    const endTime = watch("end_time");

    useEffect(() => {
        if (id) {
            fetchPlanning(id).then((data) => {
                reset({
                    start_time: data.start_time || "",
                    end_time: data.end_time || "",
                    work_saturday:
                        Number(data.work_saturday) === 1 ? "1" : "0",
                    work_sunday:
                        Number(data.work_sunday) === 1 ? "1" : "0",
                    forecast_horizon: data.forecast_horizon || "",
                    is_active: data.is_active || false,
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || "",
                    active_hour: data.active_hour || "",
                });
            });
        }
    }, [id, reset]);

    const onSubmit = async (planningData: IPlanningForm) => {
        try {
            const payload = id
                ? { ...planningData, id: Number(id) }
                : planningData;

            toast.promise(upsertPlanning(payload), {
                loading: id ? "Updating Planning..." : "Creating Planning...",
                success: () => {
                    setTimeout(() => navigate(`/planning`), 2000);
                    return id
                        ? "Planning updated successfully"
                        : "Planning created successfully!";
                },
                error: (error: unknown) =>
                    handleValidationErrors(error, setError),
            });
        } catch (error) {
            console.error("Error upon Submitting", error);
        }
    };

    // Calculate duration in minutes
    const getDuration = (start: string, end: string) => {
        if (!start || !end) return null;

        const [sh, sm] = start.split(":").map(Number);
        const [eh, em] = end.split(":").map(Number);

        return (eh * 60 + em) - (sh * 60 + sm);
    };

    // Validate active_hour based on duration
    const validateActiveHour = (value: string) => {
        const duration = getDuration(startTime, endTime);
        if (duration === null) return true;

        const [h, m] = value.split(":").map(Number);
        const activeMin = h * 60 + m;

        return (
            activeMin <= duration ||
            `Active hours cannot exceed ${Math.floor(duration / 60)}h ${
                duration % 60
            }m`
        );
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Planning" />
            <ComponentCard title={id ? "Edit Planning" : "Add Planning"}>
                <form id="form-planning" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6">

                            {/* START TIME */}
                            <Controller
                                name="start_time"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label>Working Hours (Start)</Label>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type="time"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                            <TimeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 size-6" />
                                        </div>
                                    </Field>
                                )}
                            />

                            {/* END TIME */}
                            <Controller
                                name="end_time"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label>Working Hours (End)</Label>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type="time"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                            <TimeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 size-6" />
                                        </div>
                                    </Field>
                                )}
                            />

                            {/* ACTIVE HOUR */}
                            <Controller
                                name="active_hour"
                                control={control}
                                rules={{ validate: validateActiveHour }}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label>Active Hour per Day</Label>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                type="time"
                                                step={60}
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                            <TimeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 size-6" />
                                        </div>
                                    </Field>
                                )}
                            />

                             {/* FORECAST HORIZON */}
                            <Controller
                                name="forecast_horizon"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label>Forecast Horizon</Label>
                                        <Input
                                            {...field}
                                            type="text"
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

                            {/* SATURDAY */}
                            <Controller
                                name="work_saturday"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid mt-5">
                                        <Label>Able to Work on Saturday</Label>
                                        <div className="flex gap-8">
                                            <Radio
                                                id="work_saturday_no"
                                                value="0"
                                                checked={field.value === "0"}
                                                onChange={() =>
                                                    field.onChange("0")
                                                }
                                                label="NO"
                                                name=""
                                            />
                                            <Radio
                                                id="work_saturday_yes"
                                                value="1"
                                                checked={field.value === "1"}
                                                onChange={() =>
                                                    field.onChange("1")
                                                }
                                                name=""
                                                label="YES"
                                            />
                                        </div>
                                    </div>
                                )}
                            />

                            {/* SUNDAY */}
                            <Controller
                                name="work_sunday"
                                control={control}
                                render={({ field }) => (
                                    <div className="grid mt-5">
                                        <Label>Able to Work on Sunday</Label>
                                        <div className="flex gap-8">
                                            <Radio
                                                id="work_sunday_no"
                                                value="0"
                                                checked={field.value === "0"}
                                                onChange={() =>
                                                    field.onChange("0")
                                                }
                                                label="NO"
                                                name=""

                                            />
                                            <Radio
                                                id="work_sunday_yes"
                                                value="1"
                                                checked={field.value === "1"}
                                                onChange={() =>
                                                    field.onChange("1")
                                                }
                                                label="YES"
                                                name=""

                                            />
                                        </div>
                                    </div>
                                )}
                            />

                           

                            {/* IS ACTIVE */}
                            <Controller
                                name="is_active"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <div className="grid mt-5">
                                        <Label>Is Active</Label>
                                        <div className="flex gap-8">
                                            <Radio
                                                id="is_active_no"
                                                value="0"
                                                checked={!field.value}
                                                onChange={() =>
                                                    field.onChange(false)
                                                }
                                                label="NO"
                                                name=""
                                                
                                            />
                                            <Radio
                                                id="is_active_yes"
                                                value="1"
                                                checked={field.value ? true : false}
                                                onChange={() =>
                                                    field.onChange(true)
                                                }
                                                label="YES"
                                                name=""
                                            />
                                        </div>
                                        {fieldState.error && (
                                            <p className="mt-1 text-sm text-error-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </div>
                                )}
                            />
                        </div>
                    </FieldGroup>
                </form>

                {/* BUTTONS */}
                <div className="mt-6 flex justify-end gap-3">
                    <Button
                        variant="danger"
                        onClick={() => navigate("/planning")}
                    >
                        Cancel
                    </Button>

                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>

                    <Can
                        permission={id ? "planning.edit" : "planning.create"}
                    >
                        <Button type="submit" form="form-planning">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    );
}