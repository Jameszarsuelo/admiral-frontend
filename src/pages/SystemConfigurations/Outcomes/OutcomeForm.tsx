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
import {
    bordereauStatuses,
    fetchOutcome,
    upsertOutcome,
} from "@/database/outcome_api";
import { handleValidationErrors } from "@/helper/validationError";
import {
    IOutcomeForm,
    OutcomeSchemaWithConditional,
} from "@/types/OutcomeSchema";
import Radio from "@/components/form/input/Radio";
import Can from "@/components/auth/Can";
import Select from "@/components/form/Select";

export default function OutcomeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [statusesOptions, setStatusesOptions] = useState<
        { value: number; label: string }[]
    >([]);

    const queueOptions = [
        { value: "Bordereau", label: "Bordereau" },
        { value: "Tasks", label: "Tasks" },
    ];

    const outcomeCodeHeadingOptions = [
        { value: "Successful", label: "Successful" },
        { value: "Redirect", label: "Redirect" },
        { value: "Query", label: "Query" },
        { value: "Unsuccessful", label: "Unsuccessful" },
    ];

    const platformActionOptions = [
        { value: "Terminal", label: "Terminal" },
        { value: "Query", label: "Query" },
        { value: "Query Redirect", label: "Query Redirect" },
        { value: "Query Fraud", label: "Query Fraud" },
        { value: "Queue Sensitive", label: "Queue Sensitive" },
        { value: "Queue Staff", label: "Queue Staff" },
    ];

    const { handleSubmit, control, setError, reset } = useForm<IOutcomeForm>({
        defaultValues: {
            status: "",
            outcome_code: "",
            outcome_code_heading: "",
            platform_action: "",
            classification: "",
            queue: "",
            description: "",
            comment_mandatory: false,
        },
        resolver: zodResolver(OutcomeSchemaWithConditional),
    });

    useEffect(() => {
        async function fetchStatuses() {
            const bordereauOptionResult = await bordereauStatuses(); // fetch API
            setStatusesOptions(bordereauOptionResult);
        }
        fetchStatuses();

        if (id) {
            fetchOutcome(id).then((data) => {
                console.log("Fetched outcome data:", data);
                reset({
                    status: String(data.status) || "",
                    outcome_code: data.outcome_code || "",
                    outcome_code_heading: data.outcome_code_heading || "",
                    platform_action: data.platform_action || "",
                    classification: data.classification || "",
                    queue: data.queue || "",
                    description: data.description || "",
                    comment_mandatory: data.comment_mandatory ?? false,
                });
            });
        }
    }, [id, reset]);

    const onSubmit = async (outcomeData: IOutcomeForm) => {
        try {
            // console.log(id ? true : false);
            const payload = id
                ? { ...outcomeData, id: Number(id) }
                : outcomeData;
            toast.promise(upsertOutcome(payload), {
                loading: id ? "Updating Outcome..." : "Creating Outcome...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/outcomes`);
                    }, 2000);
                    return id
                        ? "Outcome updated successfully"
                        : "Outcome created successfully!";
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
                pageTitle={id ? "Edit Outcome" : "Add Outcome"}
                pageBreadcrumbs={[{ title: "Outcome", link: "/outcomes" }]}
            />
            <ComponentCard title={id ? "Edit Outcome" : "Add Outcome"}>
                <form id="form-outcome" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="outcome_code_heading"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="outcome_code_heading">
                                                Outcome Code Heading
                                            </Label>
                                            <Select
                                                value={String(
                                                    field.value ?? "",
                                                )}
                                                options={
                                                    outcomeCodeHeadingOptions
                                                }
                                                placeholder="Select Outcome Code Heading"
                                                onChange={(value: string) =>
                                                    field.onChange(value)
                                                }
                                                onBlur={field.onBlur}
                                                className="dark:bg-dark-900"
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
                            <div>
                                {/* Bordereau, Task */}
                                <Controller
                                    name="queue"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">Queue</Label>
                                            <Select
                                                value={String(
                                                    field.value ?? "",
                                                )}
                                                options={queueOptions}
                                                placeholder="Select Queue"
                                                onChange={(value: string) =>
                                                    field.onChange(value)
                                                }
                                                onBlur={field.onBlur}
                                                className="dark:bg-dark-900"
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
                                    name="comment_mandatory"
                                    control={control}
                                    render={({ field }) => (
                                        <Field>
                                            <Label>Comment Mandatory</Label>
                                            <div className="flex items-center gap-6">
                                                <Radio
                                                    id="comment-yes"
                                                    name="comment_mandatory"
                                                    value={true}
                                                    checked={field.value === true}
                                                    label={"Yes"}
                                                    onChange={(val) =>
                                                        field.onChange(val as boolean)
                                                    }
                                                />
                                                <Radio
                                                    id="comment-no"
                                                    name="comment_mandatory"
                                                    value={false}
                                                    checked={field.value === false}
                                                    label={"No"}
                                                    onChange={(val) =>
                                                        field.onChange(val as boolean)
                                                    }
                                                />
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="platform_action"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="platform_action">
                                                Platform Action
                                            </Label>
                                            <Select
                                                value={String(field.value ?? "")}
                                                options={platformActionOptions}
                                                placeholder="Select Platform Action"
                                                onChange={(value: string) =>
                                                    field.onChange(value)
                                                }
                                                onBlur={field.onBlur}
                                                className="dark:bg-dark-900"
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
                                    name="status"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="status">
                                                Bordereau / Task Terminal Status
                                            </Label>
                                            <Select
                                                value={String(
                                                    field.value ?? "",
                                                )}
                                                options={statusesOptions}
                                                placeholder="Select Status"
                                                onChange={(value: string) =>
                                                    field.onChange(value)
                                                }
                                                onBlur={field.onBlur}
                                                className="dark:bg-dark-900"
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
                    <Button
                        variant="danger"
                        onClick={() => navigate("/outcomes")}
                    >
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Can permission={id ? "outcomes.create" : "outcomes.edit"}>
                        <Button type="submit" form="form-outcome">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    );
}
