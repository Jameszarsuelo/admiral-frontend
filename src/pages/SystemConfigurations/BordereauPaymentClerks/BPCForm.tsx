import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { useNavigate, useParams } from "react-router";
import { handleValidationErrors } from "@/helper/validationError";
import { useEffect, useMemo, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import { BPCCreateSchema, IBPCForm } from "@/types/BPCSchema";
import { fetchBpcById, upsertBpc } from "@/database/bpc_api";
import { useQuery } from "@tanstack/react-query";
import { fetchContactList } from "@/database/contact_api";

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

export default function BPCForm() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { data: lineManagerContacts } = useQuery({
        queryKey: ["contact-list", "3"],
        queryFn: async () => fetchContactList("3"),
        staleTime: 60_000,
    });

    const lineManagerOptions = useMemo(() => {
        return (
            lineManagerContacts?.map((c) => ({
                value: c.id,
                label: `${c.firstname} ${c.lastname}`.trim(),
            })) ?? []
        );
    }, [lineManagerContacts]);

    const { handleSubmit, control, reset, setError } = useForm<IBPCForm>({
        defaultValues: {
            two_fa_enabled: false,
            two_fa_type: 0,
            bpc_handle_fraud: false,
            bpc_handle_deadlock: false,
            bpc_handle_staff: false,
            bpc_handle_sensitive: false,
            bpc_line_manager: null,
            bpc_department: "",
            bpc_dept_level2: "",
            bpc_dept_level3: "",
            contact: {
                salutation: "",
                firstname: "",
                lastname: "",
                phone: "",
                mobile: "+44",
                email: "",
                organisation: "",
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "United Kingdom",
                postcode: "",
                created_by: user?.id,
            },
        },
        resolver: zodResolver(BPCCreateSchema) as any,
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchBpcById(id)
                .then((data) => {
                    const userData = (data as IBPCForm);

                    reset({
                        ...userData,
                        contact: {
                            ...userData.contact,
                            updated_by: user?.id,
                        },
                    });
                })
                .catch((error) => {
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError, user?.id]);

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    const onSubmit: SubmitHandler<IBPCForm> = async (data) => {
        toast.promise(upsertBpc(data), {
            loading: id ? "Updating BPC..." : "Creating BPC...",
            success: () => {
                setTimeout(() => {
                    navigate("/bordereau-payment-clerk");
                }, 2000);
                return id
                    ? "BPC updated successfully!"
                    : "BPC created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    };

    return (
        <>
            <PageBreadcrumb 
                pageTitle={id ? "Edit BPC" : "Add BPC"}
                pageBreadcrumbs={[{ title: "Bordereau Payment Clerk", link: "/invoice-payment-clerk" }]}
            />
            <ComponentCard title={id ? "Edit BPC" : "Add BPC"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-bpc"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <Controller
                                        name="bpc_handle_fraud"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="bpc_handle_fraud">
                                                    Handle Fraud
                                                </Label>
                                                <Switch
                                                    checked={!!field.value}
                                                    onCheckedChange={field.onChange}
                                                    label="Can handle fraud-related bordereaux."
                                                />
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="bpc_handle_deadlock"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="bpc_handle_deadlock">
                                                    Handle Deadlock
                                                </Label>
                                                <Switch
                                                    checked={!!field.value}
                                                    onCheckedChange={field.onChange}
                                                    label="Can handle deadlock/escalation cases."
                                                />
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="bpc_handle_staff"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="bpc_handle_staff">
                                                    Handle Staff
                                                </Label>
                                                <Switch
                                                    checked={!!field.value}
                                                    onCheckedChange={field.onChange}
                                                    label="Can handle staff-related cases."
                                                />
                                            </Field>
                                        )}
                                    />

                                    <Controller
                                        name="bpc_handle_sensitive"
                                        control={control}
                                        render={({ field }) => (
                                            <Field>
                                                <Label htmlFor="bpc_handle_sensitive">
                                                    Handle Sensitive
                                                </Label>
                                                <Switch
                                                    checked={!!field.value}
                                                    onCheckedChange={field.onChange}
                                                    label="Can handle sensitive cases."
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>

                                <div className="space-y-6">
                                    <Controller
                                        name="bpc_line_manager"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <Label htmlFor="bpc_line_manager">
                                                    Line Manager
                                                </Label>
                                                <Select
                                                    value={
                                                        field.value
                                                            ? String(field.value)
                                                            : ""
                                                    }
                                                    options={lineManagerOptions}
                                                    placeholder="Select Line Manager (optional)"
                                                    onChange={(value: string) =>
                                                        field.onChange(
                                                            value
                                                                ? Number(value)
                                                                : null,
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
                                        name="bpc_department"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <Label htmlFor="bpc_department">
                                                    Department
                                                </Label>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="text"
                                                    id="bpc_department"
                                                    name="bpc_department"
                                                    placeholder="(optional)"
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
                                        name="bpc_dept_level2"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <Label htmlFor="bpc_dept_level2">
                                                    Dept Level 2
                                                </Label>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="text"
                                                    id="bpc_dept_level2"
                                                    name="bpc_dept_level2"
                                                    placeholder="(optional)"
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
                                        name="bpc_dept_level3"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <Label htmlFor="bpc_dept_level3">
                                                    Dept Level 3
                                                </Label>
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ""}
                                                    type="text"
                                                    id="bpc_dept_level3"
                                                    name="bpc_dept_level3"
                                                    placeholder="(optional)"
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

                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <Controller
                                        name="contact.salutation"
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

                                    <Controller
                                        name="contact.firstname"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="firstname">
                                                    First Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="firstname"
                                                    name="firstname"
                                                    placeholder="Enter First Name"
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
                                        name="contact.lastname"
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
                                                    placeholder="Enter Last Name"
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

                                    <div>
                                        <Controller
                                            name="contact.mobile"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <Label htmlFor="mobile">
                                                        Mobile
                                                    </Label>
                                                    <PhoneInput
                                                        value={field.value}
                                                        countries={countries}
                                                        selectPosition="start"
                                                        placeholder="+44 7123 456789"
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
                                            name="contact.phone"
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
                                                        type="text"
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

                                    <Controller
                                        name="contact.email"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="email">
                                                    Email
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="email"
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

                                    <Controller
                                        name="contact.organisation"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="organisation">
                                                    Organisation
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="organisation"
                                                    name="organisation"
                                                    placeholder="Enter Organisation"
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

                                <div className="space-y-6">
                                    <Controller
                                        name="contact.address_line_1"
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

                                    <Controller
                                        name="contact.address_line_2"
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

                                    <Controller
                                        name="contact.address_line_3"
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

                                    <Controller
                                        name="contact.city"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="city">
                                                    City / Town
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

                                    <Controller
                                        name="contact.county"
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

                                    <Controller
                                        name="contact.country"
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

                                    <Controller
                                        name="contact.postcode"
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

                        <Button type="submit" form="form-bpc">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
