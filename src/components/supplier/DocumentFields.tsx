import { Controller, Control } from "react-hook-form";
import { Field } from "@/components/ui/field";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";
import Input from "@/components/form/input/InputField";
import DatePicker from "@/components/form/date-picker";
import Select from "@/components/form/Select";
import { ISupplierFormSchema } from "@/types/SupplierSchema";

export interface DocumentVisibilityOption {
    value: number;
    label: string;
}

type Props = {
    control: Control<ISupplierFormSchema>;
    documentVisibilityOptions: DocumentVisibilityOption[];
};

/**
 * Document fields component for forms with nested document structure
 * Works with document.* nested fields (e.g., in SupplierFormSchema, Document Management)
 *
 * Usage:
 * - Supplier forms: document.name, document.revision, etc.
 * - Document Management module: document.name, document.revision, etc.
 */
export default function DocumentFields({
    control,
    documentVisibilityOptions,
}: Props) {
    return (
        <>
            <div className="space-y-6">
                <Controller
                    name="document.name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label>Upload a file</Label>
                            <FileInput
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        field.onChange(file);
                                    }
                                }}
                                className="custom-class"
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
                    name="document.revision"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="revision">Revision</Label>
                            <Input
                                {...field}
                                type="text"
                                id="revision"
                                name="revision"
                                placeholder="Enter Revision"
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
                    name="document.description"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="Description">Description</Label>
                            <Input
                                {...field}
                                type="text"
                                id="Description"
                                name="Description"
                                placeholder="Enter Description"
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

            <div className="space-y-6">
                <Controller
                    name="document.expiry_date"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label htmlFor="expiry_date">Expiry Date</Label>
                            <DatePicker
                                {...field}
                                id="date-picker"
                                placement="top"
                                placeholder="Select a date"
                                onChange={(_, currentDateString) => {
                                    field.onChange(currentDateString);
                                }}
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
                    name="document.document_visibility_id"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <Label>Visibility Type</Label>
                            <Select
                                value={String(field.value ?? "")}
                                options={documentVisibilityOptions}
                                placeholder="Visibility Type"
                                onChange={(value: string) =>
                                    field.onChange(Number(value))
                                }
                                onBlur={field.onBlur}
                                className="dark:bg-dark-900 capitalize"
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
        </>
    );
}
