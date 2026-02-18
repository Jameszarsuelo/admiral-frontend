import Can from "@/components/auth/Can";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import Button from "@/components/ui/button/Button";
import { FieldGroup, Field } from "@/components/ui/field";
import { fetchWorkType, upsertWorkType } from "@/database/work_type_api";
import { handleValidationErrors } from "@/helper/validationError";
import { IWorkTypeForm, WorkTypeFormInput, WorkTypeSchema } from "@/types/WorkTypeSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const FLAG_FIELDS: Array<{ key: keyof IWorkTypeForm; label: string }> = [
    { key: "supplier_name", label: "Supplier Name" },
    { key: "bordereau", label: "Bordereau" },
    { key: "comments", label: "Comments" },
    { key: "claim_number", label: "Claim Number" },
    { key: "name", label: "Name" },
    { key: "supplier_ref", label: "Supplier Ref" },
    { key: "registration_number", label: "Registration Number" },
    { key: "invoice_date", label: "Invoice Date" },
    { key: "lot_no", label: "Lot No" },
    { key: "invoice_number", label: "Invoice Number" },
    { key: "branch_name", label: "Branch Name" },
    { key: "out_of_hours", label: "Out of Hours" },
    { key: "ph_name", label: "PH Name" },
    { key: "tp_name", label: "TP Name" },
    { key: "customer_name", label: "Customer Name" },
    { key: "payment_code_job_type", label: "Payment Code Job Type" },
    { key: "total_payment_amount", label: "Total Payment Amount" },
    { key: "copart_comments", label: "Copart Comments" },
    { key: "location", label: "Location" },
    { key: "abi_group", label: "ABI Group" },
    { key: "search_date", label: "Search Date" },
    { key: "repair_excess", label: "Repair Excess" },
    { key: "replace_excess", label: "Replace Excess" },
    { key: "incident_start", label: "Incident Start" },
    { key: "incident_date", label: "Incident Date" },
    { key: "hire_start_date", label: "Hire Start Date" },
    { key: "hire_end_date", label: "Hire End Date" },
    { key: "daily_rate", label: "Daily Rate" },
    { key: "hire_daily_rate", label: "Hire Daily Rate" },
    { key: "number_of_days_in_hire", label: "Number Of Days In Hire" },
    { key: "qty_days_in_hire", label: "Qty Days In Hire" },
    { key: "group_rate", label: "Group Rate" },
    { key: "group_hire_rate", label: "Group Hire Rate" },
    { key: "admiral_invoice_type", label: "Admiral Invoice Type" },
    { key: "amount_banked", label: "Amount Banked" },
    { key: "task_type", label: "Task Type" },
    { key: "rejection_reasons", label: "Rejection Reasons" },
    { key: "additional_information", label: "Additional Information" },
    { key: "make_and_model", label: "Make and Model" },
    { key: "postcode", label: "Postcode" },
    { key: "date", label: "Date" },
    { key: "cat", label: "Cat" },
    { key: "value", label: "Value" },
];

const WorkTypeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<WorkTypeFormInput>({
        defaultValues: {
            type: "",
            overall_value_field: "value",
        },
        resolver: zodResolver(WorkTypeSchema),
    });

    useEffect(() => {
        if (id) {
            fetchWorkType(id).then((data) => {
                reset({
                    ...(data ?? {}),
                    type: data.type || "",
                    overall_value_field:
                        data.overall_value_field ?? "value",
                });
            });
        }
    }, [id, reset]);

    const onSubmit = async (formData: WorkTypeFormInput) => {
        try {
            const parsed = WorkTypeSchema.parse(formData);
            const payload: IWorkTypeForm = id
                ? { ...parsed, id: Number(id) }
                : parsed;
            toast.promise(upsertWorkType(payload), {
                loading: id ? "Updating Work Type ..." : "Creating Work Type ...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/work-types`);
                    }, 2000);
                    return id
                        ? "Work Type updated successfully"
                        : "Work Type created successfully";
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
                pageTitle={id ? "Edit Work Type" : "Add Work Type"}
                pageBreadcrumbs={[{ title: "Work Types", link: "/work-types" }]}
            />
            <ComponentCard title={id ? "Edit Work Type" : "Add Work Type"}>
                <form id="form-work-type" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 gap-1 mt-5">
                                <Controller
                                    name="type"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="type">Type</Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="type"
                                                name="type"
                                                placeholder="Enter Work Type"
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

                            <div className="col-span-4 mt-2">
                                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                    Required Fields
                                </h4>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Tick the fields that should be required for this work type.
                                </p>
                            </div>

                            <div className="col-span-4 mt-2">
                                <h4 className="text-base font-semibold text-gray-800 dark:text-white/90">
                                    Overall Value Field
                                </h4>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                    Select exactly one field to use for overall value calculation.
                                </p>
                                <Controller
                                    name="overall_value_field"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <div className="mt-3 grid gap-3">
                                                <RadioGroup
                                                    value={String(field.value ?? "value")}
                                                    onValueChange={(v) => {
                                                        field.onChange(v);
                                                    }}
                                                >
                                                    <label className="flex items-center gap-3">
                                                        <RadioGroupItem value="total_payment_amount" />
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            Total Payment Amount
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <RadioGroupItem value="amount_banked" />
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            Amount Banked
                                                        </span>
                                                    </label>
                                                    <label className="flex items-center gap-3">
                                                        <RadioGroupItem value="value" />
                                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            Value
                                                        </span>
                                                    </label>
                                                </RadioGroup>
                                            </div>
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="col-span-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-2">
                                    {FLAG_FIELDS.map((f) => (
                                        <Controller
                                            key={String(f.key)}
                                            name={f.key}
                                            control={control}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={!!field.value}
                                                    onChange={(checked) => field.onChange(checked)}
                                                    label={f.label}
                                                />
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </FieldGroup>
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="danger" onClick={() => navigate("/work-types")}>
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Can permission={id ? "work_types.edit" : "work_types.create"}>
                        <Button type="submit" form="form-work-type">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    );
};

export default WorkTypeForm;
