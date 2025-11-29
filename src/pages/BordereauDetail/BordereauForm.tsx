import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Combobox from "@/components/form/Combobox";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import DatePicker from "@/components/form/date-picker";
import { useQuery } from "@tanstack/react-query";
import {
    fetchBordereauViewData,
    upsertBordereau,
    fetchBordereauValidationViewData,
} from "@/database/bordereau_api";
import { handleValidationErrors } from "@/helper/validationError";
import { BordereauFormSchema, IBordereauForm } from "@/types/BordereauSchema";
// import { useAuth } from "@/hooks/useAuth";

export default function BordereauForm() {
    const { id } = useParams();
    // const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading] = useState(false);

    const { handleSubmit, control, reset, setError } = useForm<IBordereauForm>({
        defaultValues: {
            supplier_id: null,
            claim_number: "",
            name: "",
            supplier_ref: "",
            registration_number: "",
            invoice_date: "",
            invoice_number: "",
            branch_name: "",
            out_of_hours: "",
            ph_name: "",
            tp_name: "",
            customer_name: "",
            payment_code_job_type: "",
            total_payment_amount: undefined,
            copart_comments: "",
            location: "",
            abi_group: "",
            repair_excess: undefined,
            replace_excess: undefined,
            incident_start: "",
            hire_start_date: "",
            hire_end_date: "",
            hire_daily_rate: undefined,
            qty_days_in_hire: undefined,
            group_hire_rate: undefined,
            admiral_invoice_type: undefined,
            amount_banked: undefined,
            comment: "",
            bordereau_file: "",
        },
        resolver: zodResolver(BordereauFormSchema),
    });

    const { data: supplierData } = useQuery({
        queryKey: ["bordereau-view-data"],
        queryFn: async () => {
            const supplierData = await fetchBordereauViewData();
            return supplierData || [];
        },
    });

    const { data: bordereauValidationData } = useQuery({
        queryKey: ["bordereau-validations"],
        queryFn: async () => {
            const bordereauValidations =
                await fetchBordereauValidationViewData();
            return bordereauValidations || [];
        },
    });

    // useEffect(() => {
    //     // placeholder for loading existing invoice when editing
    //     // fetch and reset form if id is present
    // }, [id, reset]);

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    async function onSubmit(data: IBordereauForm) {
        console.log("Submitted invoice:", data);
        toast.promise(upsertBordereau(data), {
            loading: id ? "Updating Bordereau..." : "Creating Bordereau...",
            success: () => {
                setTimeout(() => {
                    navigate("/bordereau-detail");
                }, 2000);
                return id
                    ? "Bordereau updated successfully!"
                    : "Bordereau created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Bordereau Detail" />
            <ComponentCard title={id ? "Edit Bordereau" : "Add Bordereau"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-bordereau"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <Controller
                                        name="bordereau_file"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="bordereau_file">
                                                    Bordereau
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="bordereau_file"
                                                    placeholder="Enter Bordereau"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="supplier_id"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="supplier_id">
                                                    Supplier
                                                </Label>
                                                <Combobox
                                                    value={field.value ?? ""}
                                                    options={supplierData || []}
                                                    placeholder="Select Supplier"
                                                    searchPlaceholder="Search supplier..."
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="invoice_number"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="invoice_number">
                                                    Invoice Number
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="invoice_number"
                                                    placeholder="Enter Invoice Number"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="supplier_ref"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="supplier_ref">
                                                    Supplier Reference
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="supplier_ref"
                                                    placeholder="Enter Supplier Reference"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="branch_name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="branch_name">
                                                    Branch Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="branch_name"
                                                    placeholder="Enter Branch Name"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="ph_name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="ph_name">
                                                    PH Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="ph_name"
                                                    placeholder="Enter PH Name"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="tp_name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="tp_name">
                                                    TP Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="tp_name"
                                                    placeholder="Enter TP Name"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="customer_name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="customer_name">
                                                    Customer Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="customer_name"
                                                    placeholder="Enter Customer Name"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="payment_code_job_type"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="payment_code_job_type">
                                                    Payment Code / Job Type
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="payment_code_job_type"
                                                    placeholder="Enter Payment Code or Job Type"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/** invoice_type is not part of the BordereauFormSchema - removed **/}

                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="name">
                                                    Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="name"
                                                    placeholder="Enter Name"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="registration_number"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="registration_number">
                                                    Registration Number
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="registration_number"
                                                    placeholder="Enter Registration Number"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/* Comment moved to form end as a textbox with Add button */}

                                    <Controller
                                        name="invoice_date"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="invoice_date">
                                                    Invoice Date
                                                </Label>
                                                <DatePicker
                                                    {...field}
                                                    id="invoice_date"
                                                    placement="top"
                                                    placeholder="Select invoice date"
                                                    onChange={(
                                                        _,
                                                        currentDateString,
                                                    ) => {
                                                        field.onChange(
                                                            currentDateString,
                                                        );
                                                    }}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    {/** lot_number is not part of the BordereauFormSchema - removed **/}

                                    <Controller
                                        name="copart_comments"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="copart_comments">
                                                    Copart Comments
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="copart_comments"
                                                    placeholder="Enter Copart Comments"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="out_of_hours"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="out_of_hours">
                                                    Out Of Hours
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="out_of_hours"
                                                    placeholder="Enter Out Of Hours info"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="comment"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="comment">
                                                    Comment
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="comment"
                                                    placeholder="Enter Comment"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <Controller
                                        name="total_payment_amount"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="total_payment_amount">
                                                    Total Payment Amount
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="total_payment_amount"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="repair_excess"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="repair_excess">
                                                    Repair Excess
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="repair_excess"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="replace_excess"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="replace_excess">
                                                    Replace Excess
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="replace_excess"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="location"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="location">
                                                    Location
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="location"
                                                    placeholder="Enter Location"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="abi_group"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="abi_group">
                                                    ABI Group
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="abi_group"
                                                    placeholder="Enter ABI Group"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="admiral_invoice_type"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="admiral_invoice_type">
                                                    Admiral Invoice Type
                                                </Label>
                                                <Combobox
                                                    value={field.value ?? ""}
                                                    options={
                                                        bordereauValidationData ||
                                                        []
                                                    }
                                                    placeholder="Select Admiral Invoice Type"
                                                    searchPlaceholder="Search types..."
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="hire_daily_rate"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="hire_daily_rate">
                                                    Hire Daily Rate
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="hire_daily_rate"
                                                    type="number"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="qty_days_in_hire"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="qty_days_in_hire">
                                                    Qty Days In Hire
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="qty_days_in_hire"
                                                    type="number"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="group_hire_rate"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="group_hire_rate">
                                                    Group Hire Rate
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="group_hire_rate"
                                                    type="number"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="amount_banked"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="amount_banked">
                                                    Amount Banked
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="amount_banked"
                                                    type="number"
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="incident_start"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="incident_start">
                                                    Incident Start
                                                </Label>
                                                <DatePicker
                                                    {...field}
                                                    id="incident_start"
                                                    placement="top"
                                                    placeholder="Select incident start"
                                                    onChange={(
                                                        _,
                                                        currentDateString,
                                                    ) => {
                                                        field.onChange(
                                                            currentDateString,
                                                        );
                                                    }}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="hire_start_date"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="hire_start_date">
                                                    Hire Start Date
                                                </Label>
                                                <DatePicker
                                                    {...field}
                                                    id="hire_start_date"
                                                    placement="top"
                                                    placeholder="Select hire start date"
                                                    onChange={(
                                                        _,
                                                        currentDateString,
                                                    ) => {
                                                        field.onChange(
                                                            currentDateString,
                                                        );
                                                    }}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="hire_end_date"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="hire_end_date">
                                                    Hire End Date
                                                </Label>
                                                <DatePicker
                                                    {...field}
                                                    id="hire_end_date"
                                                    placement="top"
                                                    placeholder="Select hire end date"
                                                    onChange={(
                                                        _,
                                                        currentDateString,
                                                    ) => {
                                                        field.onChange(
                                                            currentDateString,
                                                        );
                                                    }}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="claim_number"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="claim_number">
                                                    Claim Number
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="claim_number"
                                                    placeholder="Enter Claim Number"
                                                    value={field.value ?? ""}
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>
                        </FieldGroup>
                    </form>
                )}

                {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        {!id && (
                            <Button variant="outline" onClick={() => reset()}>
                                Reset
                            </Button>
                        )}

                        <Button type="submit" form="form-bordereau">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
