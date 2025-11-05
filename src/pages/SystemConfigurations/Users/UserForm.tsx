import React, { useEffect } from 'react'
import { Controller, useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import Button from "@/components/ui/button/Button";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from '@hookform/resolvers/zod';
import { handleValidationErrors } from '@/helper/validationError';
import { fetchUser, upsertUser } from '@/database/user';
import { IUserForm } from '@/types/user';
import { UserFormSchema } from '@/schema/UserFormSchema';


const countries = [
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
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

const userTypes = [
    { value: "1", label: "Admin" },
    { value: "2", label: "Supervisor" },
];

const UserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { handleSubmit, control, formState, setError, reset } = useForm<IUserForm>({
        defaultValues: {
            salutation: "",
            firstname: "",
            lastname: "",
            email: "",
            phone: "",
            mobile: "",
            twoFactor: false,
            twofaType: "",
            user_type_id: "",
            address1: "",
            address2: "",
            address3: "",
            city: "",
            county: "",
            country: "",
            postcode: ""
        },
        resolver: zodResolver(UserFormSchema)
    });

    useEffect(()=>{
        if(id){
            fetchUser(id).then((data)=>{
                reset(data);
            })
        }
    }, [id])

    const onSubmit = async (userData: IUserForm) => {
        try {
            toast.promise(
                upsertUser(userData), {
                loading: id ? "Updating User..." : "Creating User...",
                success: () => {
                    setTimeout(() => {
                        navigate("/users")
                    }, 2000);
                    return id ? "User updated successfully" : "User created successfully!";
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
            <PageBreadcrumb pageTitle="Users" />
            <ComponentCard title={"Add User"}>
                <form id="form-user" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="salutation"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                            {
                                                formState.errors.salutation && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {formState.errors.salutation.message}
                                                    </p>)
                                            }
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
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
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
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
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
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">Email</Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="email"
                                                placeholder="e.g. john@test.com"
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
                                    name="mobile"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    field.onChange(phoneNumber);
                                                }}
                                                onBlur={field.onBlur}
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
                                    name="phone"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="phone">Phone</Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="phone"
                                                name="phone"
                                                placeholder="Enter phone number"
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
                                    name="twoFactor"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Multi-factor authentication
                                            </Label>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                label="Enable multi-factor authentication to secure your account."
                                            />
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="twofaType"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="user_type_id"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="user_type_id">
                                                User Type
                                            </Label>
                                            <Select
                                                value={field.value}
                                                options={userTypes}
                                                placeholder="Select User Type"
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

                            <div className="col-span-full">
                                <Separator className="my-4" />
                            </div>

                            <div>
                                <Controller
                                    name="address1"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="address2"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div>
                                <Controller
                                    name="address3"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
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
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="city"
                                                name="city"
                                                placeholder="Enter city"
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
                                    name="county"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
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
                                            data-invalid={fieldState.invalid}
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
                                                    {fieldState.error.message}
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
                                            data-invalid={fieldState.invalid}
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
                    <Button variant="outline">
                        Reset
                    </Button>
                    <Button type="submit" form="form-user">
                        Submit
                    </Button>
                </div>
            </ComponentCard>
        </>
    )
}

export default UserForm;
export { UserForm };
