import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router";
import { fetchSupplierById, upsertSupplier } from "@/database/supplier_api";
import { handleValidationErrors } from "@/helper/validationError";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import { SupplierFormSchema } from "@/schema/SupplierFormSchema";
import { ISupplierFormSchema, ISupplierSchema } from "@/types/suppliers";

const countries = [
    { code: "UK", label: "+44" },
    { code: "PH", label: "+63" },
];
const twofaTypeOptions = [
    { value: 0, label: "SMS" },
    { value: 1, label: "Email" },
];

const salutationOptions = [
    { value: "mr", label: "Mr." },
    { value: "ms", label: "Ms." },
    { value: "mrs", label: "Mrs." },
    { value: "dr", label: "Dr." },
];

export function SupplierForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, setError, reset } =
        useForm<ISupplierFormSchema>({
            defaultValues: {
                salutation: "",
                firstname: "",
                lastname: "",
                email: "",
                phone: "",
                mobile: "+44",
                two_fa_enabled: false,
                two_fa_type: 0,
                user_type_id: 0,
                user_profile_id: 0,
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "",
                postcode: "",
                vat_number: "",
                invoice_query_email: "",
                max_payment_days: 30,
                priority: 5,
                target_payment_days: 7,
                preferred_payment_day: "",
            },
            resolver: zodResolver(SupplierFormSchema),
        });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchSupplierById(id)
                .then((data) => {
                    const supplierData = (data as ISupplierSchema).user;

                    reset({
                        id: data.id,
                        salutation: supplierData.user_info.salutation,
                        firstname: supplierData.firstname,
                        lastname: supplierData.lastname,
                        email: supplierData.email,
                        two_fa_enabled: Boolean(supplierData.two_fa_enabled),
                        two_fa_type: supplierData.two_fa_type,
                        user_type_id: supplierData.user_type_id,
                        user_profile_id: supplierData.user_profile_id,
                        phone: supplierData.user_info.phone ?? "",
                        mobile: supplierData.user_info.mobile,
                        address_line_1: supplierData.user_info.address_line_1 || "",
                        address_line_2: supplierData.user_info.address_line_2 || "",
                        address_line_3: supplierData.user_info.address_line_3 || "",
                        city: supplierData.user_info.city,
                        county: supplierData.user_info.county,
                        country: supplierData.user_info.country,
                        postcode: supplierData.user_info.postcode,
                        vat_number: data.vat_number,
                        invoice_query_email: data.invoice_query_email,
                        max_payment_days: data.max_payment_days,
                        target_payment_days: data.target_payment_days,
                        preferred_payment_day: data.preferred_payment_day || "",
                        priority: data.priority,
                    });
                })
                .catch((error) => {
                    toast.error("Failed to load Supplier data");
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError]);

    function onSubmit(data: ISupplierFormSchema) {
        toast.promise(upsertSupplier(data), {
            loading: id ? "Updating Supplier..." : "Creating Supplier...",
            success: () => {
                setTimeout(() => {
                    navigate("/suppliers");
                }, 2000);
                return id
                    ? "Supplier updated successfully!"
                    : "Supplier created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
        console.log("Submitted data:", data);
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Supplier" />
            <ComponentCard title={id ? "Edit Supplier" : "Add Supplier"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-supplier" onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="grid grid-cols-2 gap-6 ">
                                <div>
                                    <Controller
                                        name="salutation"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="salutation">
                                                    Salutation
                                                </Label>
                                                <Select
                                                    value={field.value}
                                                    options={salutationOptions}
                                                    placeholder="Select Salutation"
                                                    onChange={(value: string) =>
                                                        field.onChange(value)
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
                                </div>

                                <div>
                                    <Controller
                                        name="firstname"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="input">
                                                    First Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="input"
                                                    name="firstname"
                                                    placeholder="Enter first name"
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

                                <div>
                                    <Controller
                                        name="lastname"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="lastname">
                                                    Last Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="lastname"
                                                    name="lastname"
                                                    placeholder="Enter last name"
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

                                <div>
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="input">
                                                    Email
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="input"
                                                    name="email"
                                                    placeholder="e.g. john@test.com"
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

                                <div>
                                    <Controller
                                        name="mobile"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="input">
                                                    Mobile
                                                </Label>
                                                <PhoneInput
                                                    value={field.value}
                                                    countries={countries}
                                                    selectPosition="start"
                                                    placeholder="+1 (555) 000-0000"
                                                    onChange={(
                                                        phoneNumber: string,
                                                    ) => {
                                                        field.onChange(
                                                            phoneNumber,
                                                        );
                                                    }}
                                                    onBlur={field.onBlur}
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

                                <div>
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="phone">
                                                    Phone
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="phone"
                                                    name="phone"
                                                    placeholder="Enter phone number"
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

                                <div>
                                    <Controller
                                        name="two_fa_enabled"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="input">
                                                    Multi-factor authentication
                                                </Label>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                    label="Enable multi-factor authentication to secure your account."
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Controller
                                        name="two_fa_type"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="two_fa_type">
                                                    2FA Type
                                                </Label>
                                                <Select
                                                    value={String(
                                                        field.value ?? "",
                                                    )}
                                                    options={twofaTypeOptions}
                                                    placeholder="Select 2FA Type"
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
                                </div>

                                <div className="col-span-full">
                                    <Separator className="my-4" />
                                </div>

                                <div>
                                    <Controller
                                        name="address_line_1"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address_line_1">
                                                    Address Line 1
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address_line_1"
                                                    name="address_line_1"
                                                    placeholder="Enter address line 1"
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

                                <div>
                                    <Controller
                                        name="address_line_2"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address_line_2">
                                                    Address Line 2
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address_line_2"
                                                    name="address_line_2"
                                                    placeholder="Enter address line 2 (optional)"
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

                                <div>
                                    <Controller
                                        name="address_line_3"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address_line_3">
                                                    Address Line 3
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address_line_3"
                                                    name="address_line_3"
                                                    placeholder="Enter address line 3 (optional)"
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

                                <div>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="city">
                                                    City
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="city"
                                                    name="city"
                                                    placeholder="Enter city"
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

                                <div>
                                    <Controller
                                        name="county"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="county">
                                                    County
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="county"
                                                    name="county"
                                                    placeholder="Enter county"
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

                                <div>
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="country">
                                                    Country
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="country"
                                                    name="country"
                                                    placeholder="Enter country"
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

                                <div>
                                    <Controller
                                        name="postcode"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="postcode">
                                                    Postcode
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="postcode"
                                                    name="postcode"
                                                    placeholder="Enter postcode"
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

                                <div className="col-span-full">
                                    <Separator className="my-4" />
                                </div>

                                <div>
                                    <Controller
                                        name="vat_number"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="vat_number">
                                                    VAT number
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="vat_number"
                                                    name="vat_number"
                                                    placeholder="Enter VAT number"
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

                                <div>
                                    <Controller
                                        name="invoice_query_email"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="invoice_query_email">
                                                    Invoice Query Email
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="invoice_query_email"
                                                    name="invoice_query_email"
                                                    placeholder="e.g. john@test.com"
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

                                <div>
                                    <Controller
                                        name="max_payment_days"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="max_payment_days">
                                                    Max Payment Days
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="max_payment_days"
                                                    name="max_payment_days"
                                                    placeholder="30"
                                                    value={
                                                        field.value ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
                                                    onBlur={field.onBlur}
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

                                <div>
                                    <Controller
                                        name="target_payment_days"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="target_payment_days">
                                                    Target Payment Days
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    id="target_payment_days"
                                                    name="target_payment_days"
                                                    placeholder="30"
                                                    value={
                                                        field.value ?? ""
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
                                                    onBlur={field.onBlur}
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

                                <div>
                                    <Controller
                                        name="preferred_payment_day"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="preferred_payment_day">
                                                    Preferred Payment Day
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="preferred_payment_day"
                                                    name="preferred_payment_day"
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

                                <div>
                                    <Controller
                                        name="priority"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="priority">
                                                    Priority
                                                </Label>
                                                <Input
                                                    type="number"
                                                    id="priority"
                                                    name="priority"
                                                    placeholder="Default: 5, Min: 1, Max: 10"
                                                    min={1}
                                                    max={10}
                                                    value={field.value ?? ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
                                                    onBlur={field.onBlur}
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

                        <Button type="submit" form="form-supplier">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
