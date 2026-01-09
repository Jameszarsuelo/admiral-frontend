import { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Field } from "@/components/ui/field";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import Button from "@/components/ui/button/Button";
import Combobox from "@/components/form/Combobox";
import DatePicker from "@/components/form/date-picker";
import Spinner from "@/components/ui/spinner/Spinner";
import { handleValidationErrors } from "@/helper/validationError";
import { fetchDocumentTypeList } from "@/database/document_type_api";
import { fetchDocumentVisibilityList } from "@/database/document_visibility_api";
import { fetchSupplierList } from "@/database/supplier_api";
import { IDocumentFormSchema } from "@/types/DocumentSchema";
import { fetchDocumentById, upsertDocument } from "@/database/document_api";
import { Textarea } from "@/components/ui/textarea";
import Radio from "@/components/form/input/Radio";

export default function DMForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const [isObsolete, setIsObsolete] = useState(false);

    const { handleSubmit, control, reset, setError } =
        useForm<IDocumentFormSchema>({
            defaultValues: {
                id: undefined,
                name: "",
                revision: "",
                description: "",
                document_type_id: undefined,
                expiry_date: undefined,
                location: "",
                document_visibility_id: undefined,
                supplier_id: undefined,
            },
        });

    useEffect(() => {
        if (id) {
                    setIsLoading(true);
                    fetchDocumentById(id)
                        .then((data) => {
                            const documentData = data as IDocumentFormSchema;

                            reset({
                                ...documentData,
                            });
                            setIsObsolete(Boolean((documentData as any).is_obsolete));
                        })
                .catch((error) => {
                    return handleValidationErrors(error, setError);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id, reset, setError]);

    // FETCHING DOCUMENT TYPES
    const { data: documentTypeOptions = [] } = useQuery({
        queryKey: ["document-type-list"],
        queryFn: fetchDocumentTypeList,
        select: (document_type) =>
            (document_type ?? []).map((dt) => ({
                value: Number(dt.id),
                label: dt.type,
            })),
        placeholderData: [],
        staleTime: 1000 * 60 * 5,
    });

    // FETCHING DOCUMENT VISIBILITIES
    const { data: documentVisibilityOptions = [] } = useQuery({
        queryKey: ["document-visibility-list"],
        queryFn: fetchDocumentVisibilityList,
        select: (document_visibility) =>
            (document_visibility ?? []).map((dv) => ({
                value: Number(dv.id),
                label: dv.name,
            })),
        placeholderData: [],
        staleTime: 1000 * 60 * 5,
    });

    // FETCHING SUPPLIER
    const { data: supplierOptions = [] } = useQuery({
        queryKey: ["supplier-list"],
        queryFn: fetchSupplierList,
        select: (document_visibility) =>
            (document_visibility ?? []).map((dv) => ({
                value: Number(dv.id),
                label: dv.name,
            })),
        placeholderData: [],
        staleTime: 1000 * 60 * 5,
    });

    async function onSubmit(data: IDocumentFormSchema) {
        // include is_obsolete in payload
        (data as any).is_obsolete = isObsolete;

        toast.promise(upsertDocument(data), {
            loading: id ? "Updating Document..." : "Creating Document...",
            success: () => {
                setTimeout(() => {
                    navigate("/document-management");
                }, 2000);
                return id
                    ? "Module updated successfully!"
                    : "Module created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    function onError(errors: unknown) {
        console.log("Form validation errors:", errors);
        toast.error("Please fix the errors in the form");
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={
                    id ? "Edit Document Management" : "Add Document Management"
                }
                pageBreadcrumbs={[
                    {
                        title: "Document Management",
                        link: "/document-management",
                    },
                ]}
            />
            <ComponentCard title={id ? "Edit Document" : "Add Document"}>
                {/* <ComponentCard title="Document Management"> */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="document-form"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <div className="grid grid-cols-12 gap-4 md:gap-6">
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label>Document Name</Label>
                                                <div className="flex flex-col gap-2">
                                                    <FileInput
                                                        onChange={(e) => {
                                                            const file =
                                                                e.target.files?.[0];
                                                            if (file) {
                                                                field.onChange(
                                                                    file
                                                                );
                                                            }
                                                        }}
                                                        className="custom-class"
                                                    />
                                                    {typeof field.value === 'string' && field.value && (
                                                        <div className="text-sm text-gray-600">
                                                            Current file: {field.value}
                                                        </div>
                                                    )}
                                                </div>
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
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="revision"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="name">
                                                    Revision
                                                </Label>
                                                <Input
                                                    {...field}
                                                    id="revision"
                                                    placeholder="Enter revision"
                                                    value={field.value ?? ""}
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="document_type_id"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState?.invalid
                                                }
                                            >
                                                <Label htmlFor="document_type_id">
                                                    Document Type
                                                </Label>
                                                <Combobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    options={
                                                        documentTypeOptions
                                                    }
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value)
                                                        )
                                                    }
                                                    placeholder="Select Document Type"
                                                    searchPlaceholder="Search document type..."
                                                    emptyText="No document type found."
                                                />
                                                {fieldState?.error && (
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
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="expiry_date"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="expiry_date">
                                                    Expiry Date
                                                </Label>
                                                <DatePicker
                                                    id="expiry_date"
                                                    placement="top"
                                                    placeholder="Date from"
                                                    defaultDate={
                                                        field.value ?? undefined
                                                    }
                                                    onChange={(_selectedDates, dateStr) => {
                                                        // pass the date string (YYYY-MM-DD) to RHF
                                                        field.onChange(dateStr || null);
                                                    }}
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="document_visibility_id"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState?.invalid
                                                }
                                            >
                                                <Label htmlFor="document_visibility_id">
                                                    Document Visibility
                                                </Label>
                                                <Combobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    options={
                                                        documentVisibilityOptions
                                                    }
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value)
                                                        )
                                                    }
                                                    placeholder="Select Document Visibility"
                                                    searchPlaceholder="Search document visibility..."
                                                    emptyText="No document visibility found."
                                                />
                                                {fieldState?.error && (
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
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="supplier_id"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState?.invalid
                                                }
                                            >
                                                <Label htmlFor="supplier_id">
                                                    Supplier
                                                </Label>
                                                <Combobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    options={supplierOptions}
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value)
                                                        )
                                                    }
                                                    placeholder="Select Supplier"
                                                    searchPlaceholder="Search supplier..."
                                                    emptyText="No supplier found."
                                                />
                                                {fieldState?.error && (
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
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="name">
                                                    Description
                                                </Label>
                                                <Textarea
                                                    {...field}
                                                    id="description"
                                                    placeholder="Enter description"
                                                    value={field.value ?? ""}
                                                    rows={5}
                                                />
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>
                            <div className="col-span-12 space-y-6 xl:col-span-6">
                                <div>
                                    <Label className="mb-4">Include Obsolete</Label>
                                    <div className="flex items-center gap-4">
                                        <Radio
                                            id="obsolete_no"
                                            value="0"
                                            checked={!isObsolete}
                                            onChange={() => setIsObsolete(false)}
                                            label="No"
                                            name="include_obsolete"
                                        />
                                        <Radio
                                            id="obsolete_yes"
                                            value="1"
                                            checked={isObsolete}
                                            onChange={() => setIsObsolete(true)}
                                            label="Yes"
                                            name="include_obsolete"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {!isLoading && (
                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="danger"
                                    onClick={() => navigate(-1)}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" form="document-form">
                                    Save
                                </Button>
                            </div>
                        )}
                    </form>
                )}
            </ComponentCard>
        </>
    );
}
