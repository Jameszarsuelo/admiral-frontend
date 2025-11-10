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
import { handleValidationErrors } from "@/helper/validationError";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchIpcById, upsertIpc } from "@/database/ipc_api";
import { IUserForm } from "@/types/user";
import { UserFormSchema } from "@/types/UserFormSchema";
import { IIPCSchema } from "@/types/ipc";

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

export default function IPCForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, setError, reset } = useForm<IUserForm>({
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
        },
        resolver: zodResolver(UserFormSchema),
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchIpcById(id)
                .then((data) => {
                    const userData = (data as IIPCSchema).user;

                    reset({
                        id: data.id,
                        firstname: userData.firstname,
                        lastname: userData.lastname,
                        email: userData.email,
                        two_fa_enabled: Boolean(userData.two_fa_enabled),
                        two_fa_type: userData.two_fa_type,
                        user_type_id: userData.user_type_id,
                        user_profile_id: userData.user_profile_id,
                        salutation: userData.user_info.salutation,
                        phone: userData.user_info.phone || "",
                        mobile: userData.user_info.mobile,
                        address_line_1: userData.user_info.address_line_1 || "",
                        address_line_2: userData.user_info.address_line_2 || "",
                        address_line_3: userData.user_info.address_line_3 || "",
                        city: userData.user_info.city,
                        county: userData.user_info.county,
                        country: userData.user_info.country,
                        postcode: userData.user_info.postcode,
                    });
                })
                .catch((error) => {
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError]);

    async function onSubmit(data: IUserForm) {
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
                return handleValidationErrors(error, setError);
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
                    <form id="form-ipc" onSubmit={handleSubmit(onSubmit)}>
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

                        <Button type="submit" form="form-ipc">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
