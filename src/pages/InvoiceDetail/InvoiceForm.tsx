import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    InvoiceCreateSchema,
    IInvoiceCreateSchema,
} from "@/types/InvoiceSchema";
import { useQuery } from "@tanstack/react-query";
import { fetchInvoiceViewData, upsertInvoice } from "@/database/invoice_api";
import { handleValidationErrors } from "@/helper/validationError";
// import { useAuth } from "@/hooks/useAuth";

export default function InvoiceForm() {
    const { id } = useParams();
    // const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading] = useState(false);

    const { handleSubmit, control, reset, setError } =
        useForm<IInvoiceCreateSchema>({
            defaultValues: {
                ipc_id: undefined,
                supplier_id: undefined,
                invoice_number: "",
                supplier_reference: "",
                invoice_type: "",
                invoice_info: {
                    description: "",
                    ooh_instructions: "",
                    amount_due_total: undefined,
                    amount_due_cost: undefined,
                    amount_due_vat: undefined,
                    amount_currency: "GBP",
                    claim_number: "",
                    claimant_registration: "",
                    claimant_name: "",
                },
            },
            resolver: zodResolver(InvoiceCreateSchema),
        });

    const { data: supplierData } = useQuery({
        queryKey: ["invoice-view-data"],
        queryFn: async () => {
            return await fetchInvoiceViewData();
        },
    });

    const suppliers = supplierData?.suppliers || [];

    useEffect(() => {
        // placeholder for loading existing invoice when editing
        // fetch and reset form if id is present
    }, [id, reset]);

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    async function onSubmit(data: IInvoiceCreateSchema) {
        console.log("Submitted invoice:", data);
        toast.promise(upsertInvoice(data), {
            loading: id ? "Updating Invoice..." : "Creating Invoice...",
            success: () => {
                setTimeout(() => {
                    // navigate("/invoice-detail");
                }, 2000);
                return id
                    ? "Invoice updated successfully!"
                    : "Invoice created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Invoice" />
            <ComponentCard title={id ? "Edit Invoice" : "Add Invoice"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-invoice"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <Controller
                                        name="supplier_id"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="two_fa_type">
                                                    Supplier
                                                </Label>
                                                <Select
                                                    value={String(
                                                        field.value ?? "",
                                                    )}
                                                    options={suppliers}
                                                    placeholder="Select Supplier"
                                                    onChange={(value: string) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                    onBlur={field.onBlur}
                                                    className="dark:bg-dark-900"
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
                                        name="supplier_reference"
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
                                        name="invoice_type"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="invoice_type">
                                                    Invoice Type
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="invoice_type"
                                                    placeholder="Enter Invoice Type"
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
                                        name="invoice_info.description"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="description">
                                                    Description
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="description"
                                                    placeholder="Enter Description"
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
                                        name="invoice_info.ooh_instructions"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="ooh_instructions">
                                                    OOH Instructions
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="ooh_instructions"
                                                    placeholder="Enter OOH Instructions"
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
                                        name="invoice_info.amount_due_total"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="amount_due_total">
                                                    Amount Due Total
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="amount_due_total"
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
                                        name="invoice_info.amount_due_cost"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="amount_due_cost">
                                                    Amount Due Cost
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="amount_due_cost"
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
                                        name="invoice_info.amount_due_vat"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="amount_due_vat">
                                                    Amount Due VAT
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="amount_due_vat"
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
                                        name="invoice_info.amount_currency"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="amount_currency">
                                                    Amount Currency
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="amount_currency"
                                                    placeholder="e.g. GBP"
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
                                        name="invoice_info.claim_number"
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

                                    <Controller
                                        name="invoice_info.claimant_registration"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="claimant_registration">
                                                    Claimant Registration
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="claimant_registration"
                                                    placeholder="Enter Claimant Registration"
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
                                        name="invoice_info.claimant_name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="claimant_name">
                                                    Claimant Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="claimant_name"
                                                    placeholder="Enter Claimant Name"
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

                        <Button type="submit" form="form-invoice">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
