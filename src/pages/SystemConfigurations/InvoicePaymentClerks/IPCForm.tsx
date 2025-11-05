import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

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
import { upsertIpc, fetchIpcById } from "@/database/ipc";
import { handleValidationErrors } from "@/helper/validationError";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";

const formSchema = z.object({
    id: z.number().optional(),
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    twoFactor: z.boolean(),
    twofaType: z.string().min(1, "2FA type is required"),
    salutation: z.string().min(1, "Salutation is required"),
    phone: z.string(),
    mobile: z
        .string()
        .min(1, "Mobile number is required")
        .regex(
            /^\+?\d+$/,
            "Mobile number must contain only numbers and an optional + at the start",
        ),
    address1: z.string().min(1, "Address line 1 is required"),
    address2: z.string().optional(),
    address3: z.string().optional(),
    city: z.string().min(1, "City is required"),
    county: z.string().min(1, "County is required"),
    country: z.string().min(1, "Country is required"),
    postcode: z.string().min(1, "Postcode is required"),
});

const countries = [
    // { code: "US", label: "+1" },
    // { code: "GB", label: "+44" },
    // { code: "CA", label: "+1" },
    // { code: "AU", label: "+61" },
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

export function IPCForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            twoFactor: false,
            twofaType: "",
            salutation: "",
            phone: "",
            mobile: "+44",
            address1: "",
            address2: "",
            address3: "",
            city: "",
            county: "",
            country: "",
            postcode: "",
        },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchIpcById(id)
                .then((data) => {
                    form.reset({
                        id: data.id,
                        firstname: data.firstname || "",
                        lastname: data.lastname || "",
                        email: data.email || "",
                        twoFactor: data["2fa_enabled"] === 1,
                        twofaType: data["2fa_type"]?.toString() || "",
                        salutation: data.user_info?.salutation || "",
                        phone: data.user_info?.phone || "",
                        mobile: data.user_info?.mobile || "+44",
                        address1: data.user_info?.address_line_1 || "",
                        address2: data.user_info?.address_line_2 || "",
                        address3: data.user_info?.address_line_3 || "",
                        city: data.user_info?.city || "",
                        county: data.user_info?.county || "",
                        country: data.user_info?.country || "",
                        postcode: data.user_info?.postcode || "",
                    });
                })
                .catch((error) => {
                    toast.error("Failed to load IPC data");
                    console.error(error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, form]);

    async function onSubmit(data: z.infer<typeof formSchema>) {
        toast.promise(upsertIpc(data), {
            loading: id ? "Updating IPC..." : "Creating IPC...",
            success: () => {
                setTimeout(() => {
                    navigate("/invoice-payment-clerk");
                }, 2000);
                return id
                    ? "IPC updated successfully!"
                    : "IPC created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, form.setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Invoice Payment Clerk" />
            <ComponentCard title={id ? "Edit IPC" : "Add IPC"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-ipc" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="grid grid-cols-2 gap-6 ">
                                <div>
                                    <Controller
                                        name="salutation"
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        name="phone"
                                        control={form.control}
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

                                <div>
                                    <Controller
                                        name="twoFactor"
                                        control={form.control}
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
                                        name="twofaType"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="twofaType">
                                                    2FA Type
                                                </Label>
                                                <Select
                                                    value={field.value}
                                                    options={twofaTypeOptions}
                                                    placeholder="Select 2FA Type"
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

                                <div className="col-span-full">
                                    <Separator className="my-4" />
                                </div>

                                <div>
                                    <Controller
                                        name="address1"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address1">
                                                    Address Line 1
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address1"
                                                    name="address1"
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
                                        name="address2"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address2">
                                                    Address Line 2
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address2"
                                                    name="address2"
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
                                        name="address3"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="address3">
                                                    Address Line 3
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="address3"
                                                    name="address3"
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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
                                        control={form.control}
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
                            <Button
                                variant="outline"
                                onClick={() => form.reset()}
                            >
                                Reset
                            </Button>
                        )}

                        <Button type="submit" form="form-ipc">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
