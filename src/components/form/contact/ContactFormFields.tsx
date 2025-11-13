import { Controller, Control, FieldErrors } from "react-hook-form";
import Label from "@/components/form/Label";
import { Field, FieldGroup } from "@/components/ui/field";
import Input from "@/components/form/input/InputField";
import Select from "@/components/form/Select";
import PhoneInput from "@/components/form/group-input/PhoneInput";
import { IContactCreateSchema } from "@/types/ContactSchema";

const countries = [
    { code: "UK", label: "+44" },
    { code: "PH", label: "+63" },
];

const salutationOptions = [
    { value: "mr", label: "Mr." },
    { value: "ms", label: "Ms." },
    { value: "mrs", label: "Mrs." },
    { value: "dr", label: "Dr." },
];

const contactTypeOptions = [
    { value: "1", label: "Contact" },
    { value: "2", label: "Supplier" },
    { value: "3", label: "User" },
];

interface ContactFormFieldsProps {
    control: Control<IContactCreateSchema>;
    errors: FieldErrors<IContactCreateSchema>;
}

export default function ContactFormFields({ control }: ContactFormFieldsProps) {
    return (
        <FieldGroup>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-6">
                    <Controller
                        name="type"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="type">Contact Type</Label>
                                <Select
                                    value={field.value}
                                    options={contactTypeOptions}
                                    placeholder="Select Type"
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

                    <Controller
                        name="salutation"
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

                    <Controller
                        name="firstname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="firstname">First Name</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="firstname"
                                    name="firstname"
                                    placeholder="Enter First Name"
                                />
                                {fieldState.error && (
                                    <p className="mt-1 text-sm text-error-500">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="lastname"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="lastname">Last Name</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="lastname"
                                    name="lastname"
                                    placeholder="Enter Last Name"
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
                            name="mobile"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <Label htmlFor="mobile">Mobile</Label>
                                    <PhoneInput
                                        value={field.value}
                                        countries={countries}
                                        selectPosition="start"
                                        placeholder="+44 7123 456789"
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
                            name="phone"
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

                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...field}
                                    type="text"
                                    id="email"
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

                    <Controller
                        name="organisation"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />
                </div>

                {/* RIGHT COLUMN: Address Info */}
                <div className="space-y-6">
                    <Controller
                        name="address_line_1"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="address_line_2"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="address_line_3"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
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
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </Field>
                        )}
                    />

                    <Controller
                        name="city"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <Label htmlFor="city">City / Town</Label>
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

                    <Controller
                        name="county"
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

                    <Controller
                        name="country"
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

                    <Controller
                        name="postcode"
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
