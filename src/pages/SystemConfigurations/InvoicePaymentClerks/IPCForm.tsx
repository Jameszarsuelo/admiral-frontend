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
import { useParams } from "react-router";

const formSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    twoFactor: z.boolean(),
    TwofaType: z.string().min(1, "2FA type is required"),
    salutation: z.string().min(1, "Salutation is required"),
    phone: z.string().min(1, "Phone is required"),
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
    { code: "US", label: "+1" },
    { code: "GB", label: "+44" },
    { code: "CA", label: "+1" },
    { code: "AU", label: "+61" },
    { code: "PH", label: "+63" },
];
const twofaTypeOptions = [
    { value: "sms", label: "SMS" },
    { value: "email", label: "Email" },
];

const salutationOptions = [
    { value: "mr", label: "Mr." },
    { value: "ms", label: "Ms." },
    { value: "mrs", label: "Mrs." },
    { value: "dr", label: "Dr." },
];

export function IPCForm() {
    const { id } = useParams();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            twoFactor: false,
            TwofaType: "",
            salutation: "",
            phone: "",
            mobile: "",
            address1: "",
            address2: "",
            address3: "",
            city: "",
            county: "",
            country: "",
            postcode: "",
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-black">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        });
        console.log("Submitted data:", data);
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Invoice Payment Clerk" />
            <ComponentCard title={id ? "Edit IPC" : "Add IPC"}>
                <form id="form-ipc" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-6 ">
                            <div>
                                <Controller
                                    name="salutation"
                                    control={form.control}
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
                                    name="firstname"
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    name="TwofaType"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="TwofaType">
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

                            <div className="col-span-full">
                                <Separator className="my-4" />
                            </div>

                            <div>
                                <Controller
                                    name="address1"
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                                    control={form.control}
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
                            {/* <div>
                        <Label htmlFor="inputTwo">Input with Placeholder</Label>
                        <Input
                            type="text"
                            id="inputTwo"
                            placeholder="info@gmail.com"
                        />
                    </div>
                    <div>
                        <Label>Select Input</Label>
                        <Select
                            options={options}
                            placeholder="Select an option"
                            onChange={handleSelectChange}
                            className="dark:bg-dark-900"
                        />
                    </div>
                    
                    <div>
                        <DatePicker
                            id="date-picker"
                            label="Date Picker Input"
                            placeholder="Select a date"
                            onChange={(dates, currentDateString) => {
                                // Handle your logic
                                console.log({ dates, currentDateString });
                            }}
                        />
                    </div> */}
                        </div>
                    </FieldGroup>
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-ipc">
                        Submit
                    </Button>
                </div>
            </ComponentCard>
        </>
    );
}
