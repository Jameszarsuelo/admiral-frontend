import { Controller, Control } from "react-hook-form";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { Separator } from "@/components/ui/separator";
import { IUserCreate } from "@/types/UserSchema";

const countries = [
    { code: "UK", label: "+44" },
    { code: "PH", label: "+63 " },
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

type Props = {
    control: Control<IUserCreate>;
};

export default function SupplierUserFormFields({ control }: Props) {
    return (
        <FieldGroup>
            <div className="grid grid-cols-2 gap-6 ">
                <div>
                    <Controller
                        name="contact.salutation"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="salutation">Salutation</Label>
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
                        name="contact.firstname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="input">First Name</Label>
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
                        name="contact.lastname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="lastname">Last Name</Label>
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
                            <Field data-invalid={fieldState.invalid}>
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
                        name="contact.mobile"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="input">Mobile</Label>
                                <PhoneInput
                                    value={field.value}
                                    countries={countries}
                                    selectPosition="start"
                                    placeholder="+1 (555) 000-0000"
                                    onChange={(phoneNumber: string) => {
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
                        name="contact.phone"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                        name="two_fa_enabled"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="input">Multi-factor authentication</Label>
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
                        name="two_fa_type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="two_fa_type">2FA Type</Label>
                                <Select
                                    value={String(field.value ?? "")}
                                    options={twofaTypeOptions}
                                    placeholder="Select 2FA Type"
                                    onChange={(value: string) =>
                                        field.onChange(Number(value))
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

                <Controller
                    name="contact.organisation"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="organisation">Organisation</Label>
                            <Input
                                {...field}
                                type="text"
                                id="organisation"
                                name="organisation"
                                placeholder="Enter Organisation"
                            />
                            {fieldState.error && (
                                <p className="mt-1 text-sm text-error-500">
                                    {fieldState.error.message}
                                </p>
                            )}
                        </Field>
                    )}
                />

                <div>
                    <Controller
                        name="contact.address_line_1"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="address_line_1">Address Line 1</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="address_line_1"
                                    name="address_line_1"
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
                        name="contact.address_line_2"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="address_line_2">Address Line 2</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="address_line_2"
                                    name="address_line_2"
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
                        name="contact.address_line_3"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="address_line_3">Address Line 3</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="address_line_3"
                                    name="address_line_3"
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
                        name="contact.city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                        name="contact.county"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="county">County</Label>
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
                        name="contact.country"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="country">Country</Label>
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
                        name="contact.postcode"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="postcode">Postcode</Label>
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
    );
}
