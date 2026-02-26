import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
import { Separator } from "@/components/ui/separator";
import { useNavigate, useParams } from "react-router";
import { fetchSupplierById, upsertSupplier } from "@/database/supplier_api";
import { handleValidationErrors } from "@/helper/validationError";
import { useEffect, useState } from "react";
import Spinner from "@/components/ui/spinner/Spinner";
import {
    ISupplierFormSchema,
    ISupplierFormInputSchema,
    SupplierFormSchema,
} from "@/types/SupplierSchema";
import { useAuth } from "@/hooks/useAuth";
import { fetchDocumentVisibilityList } from "@/database/document_visibility_api";
import { fetchContactListSupplier } from "@/database/contact_api";
import SupplierUserModal from "@/components/modal/SupplierUserModal";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Combobox from "@/components/form/Combobox";
import DocumentFields from "@/components/supplier/DocumentFields";
import AddSupplierContactsTable from "./SupplierContactsTable/AddSupplierContactsTable";
import SupplierContactsTable from "./SupplierContactsTable/SupplierContactTable";
import SupplierDocumentsTable from "./SupplierDocumentTable/SupplierDocumentsTable";
import { IDocumentFormSchema } from "@/types/DocumentSchema";
import { upsertDocument } from "@/database/document_api";
import { useForm as useLocalForm } from "react-hook-form";

interface DocumentVisibilityOption {
    value: number;
    label: string;
}

export default function SupplierForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const contactTypeLabel: Record<string, string> = {
        "1": "Contact",
        "2": "Supplier",
        "3": "User",
    };
    const [documentVisibilityOptions, setDocumentVisibilityOptions] = useState<
        DocumentVisibilityOption[]
    >([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
    const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);

    const docForm = useLocalForm<{ document: Partial<IDocumentFormSchema> }>({
        defaultValues: {
            document: {
                name: "",
                revision: "",
                description: "",
                expiry_date: "",
                document_visibility_id: 1,
            },
        },
    });

    async function handleAddDocument(values: {
        document: Partial<IDocumentFormSchema>;
    }) {
        setIsUploadingDoc(true);
        const payload: Record<string, unknown> = { ...(values.document || {}) };
        if (id) payload["supplier_id"] = Number(id);

        try {
            await toast.promise(
                upsertDocument(payload as IDocumentFormSchema),
                {
                    loading: "Uploading document...",
                    success: "Document uploaded",
                    error: "Failed to upload document",
                },
            );
            docForm.reset();
            setIsAddDocModalOpen(false);
            refetchSupplier?.();
        } finally {
            setIsUploadingDoc(false);
        }
    }

    // Fetch contacts for dropdown
    const { data: contacts = [], refetch: refetchContacts } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContactListSupplier,
    });

    // Fetch current supplier data if editing
    const {
        data: supplierData,
        isLoading,
        refetch: refetchSupplier,
    } = useQuery({
        queryKey: ["supplier", id],
        queryFn: () => (id ? fetchSupplierById(id) : null),
        enabled: !!id,
    });

    // Transform contacts to dropdown options
    const contactOptions = contacts
        .filter((contact) => ["1", "2", "3"].includes(String(contact.type)))
        .filter((contact) => Boolean(contact.id))
        .map((contact) => {
            const typeLabel = contactTypeLabel[String(contact.type)] ?? "Contact";
            const fullName = `${contact.firstname} ${contact.lastname}`.trim();
            const orgSuffix = contact.organisation
                ? ` - ${contact.organisation}`
                : "";

            return {
                value: contact.id as number,
                label: `${fullName}${orgSuffix} (${typeLabel})`,
            };
        });

    const { handleSubmit, control, setError, reset, setValue } =
        useForm<ISupplierFormInputSchema>({
            defaultValues: {
                name: "",
                logo: undefined,
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "United Kingdom",
                postcode: "",
                phone: "",
                bordereau_query_email: "",
                max_payment_days: 30,
                target_payment_days: 7,
                preferred_payment_day: "",
                priority: 5,
                contact_id: undefined,
                document: {
                    name: "",
                    revision: "",
                    description: "",
                    expiry_date: "",
                    document_visibility_id: 1,
                    uploaded_by: user?.id,
                },
            },
            resolver: zodResolver(SupplierFormSchema),
        });

    // Reset form with supplier data when editing
    useEffect(() => {
        if (supplierData) {
            const normalizedData = {
                ...supplierData,
                updated_by: user?.id,
            };
            reset(normalizedData as ISupplierFormInputSchema);
        }
    }, [supplierData, reset, user]);

    function onSubmit(formValues: ISupplierFormInputSchema) {
        const data: ISupplierFormSchema = SupplierFormSchema.parse(formValues);

        toast.promise(upsertSupplier(data), {
            loading: id ? "Updating Supplier..." : "Creating Supplier...",
            success: () => {
                setTimeout(() => {
                    navigate("/supplier-directory");
                }, 2000);
                return id
                    ? "Supplier updated successfully!"
                    : "Supplier created successfully!";
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

    useEffect(() => {
        const fetchData = async () => {
            const dvData = await fetchDocumentVisibilityList();

            setDocumentVisibilityOptions(
                dvData.map((dv) => ({ value: dv.id, label: dv.name })),
            );
        };

        fetchData();
    }, []);

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Supplier" : "Add Supplier"}
                pageBreadcrumbs={[
                    { title: "Supplier", link: "/supplier-directory" },
                ]}
            />
            <ComponentCard title={id ? "Edit Supplier" : "Add Supplier"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form
                        id="form-supplier"
                        onSubmit={handleSubmit(onSubmit, onError)}
                    >
                        <FieldGroup>
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div className="space-y-6">
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="name">
                                                    Supplier Name
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    placeholder="Enter Supplier Name"
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
                                        name="logo"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label>Supplier Logo </Label>
                                                <FileInput
                                                    onChange={(e) => {
                                                        const file =
                                                            e.target.files?.[0];
                                                        field.onChange(file);
                                                    }}
                                                    className="custom-class"
                                                />

                                                {field.value && (
                                                    typeof field.value === "string" ? (
                                                        <img
                                                            src={import.meta.env.VITE_API_URL + field.value}
                                                            alt="logo-preview"
                                                            className="h-auto mt-2 rounded"
                                                        />
                                                    ) : (
                                                        <img
                                                            src={URL.createObjectURL(field.value as File)}
                                                            alt="logo-preview"
                                                            className="h-auto mt-2 rounded"
                                                        />
                                                    )
                                                )}

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
                                        name="phone"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="phone">
                                                    Generic Phone Number
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

                                    <Controller
                                        name="bordereau_query_email"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                data-invalid={
                                                    fieldState.invalid
                                                }
                                            >
                                                <Label htmlFor="bordereau_query_email">
                                                    Bordereau Query Email
                                                </Label>
                                                <Input
                                                    {...field}
                                                    type="text"
                                                    id="bordereau_query_email"
                                                    name="bordereau_query_email"
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

                                    <div>
                                        <Controller
                                            name="contact_id"
                                            control={control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <Label htmlFor="contact_id">
                                                        Primary Contact
                                                    </Label>
                                                    <div className="flex gap-2 w-full">
                                                        <div className="flex-1">
                                                            <Combobox
                                                                value={
                                                                    field.value
                                                                }
                                                                options={
                                                                    contactOptions
                                                                }
                                                                onChange={(
                                                                    value,
                                                                ) =>
                                                                    field.onChange(
                                                                        Number(
                                                                            value,
                                                                        ),
                                                                    )
                                                                }
                                                                placeholder="Select Primary Contact"
                                                                searchPlaceholder="Search contact..."
                                                                emptyText="No contact found."
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setIsContactModalOpen(
                                                                    true,
                                                                )
                                                            }
                                                            className="flex items-center gap-1 whitespace-nowrap"
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                            Add Contact
                                                        </Button>
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
                                                    Supplier Priority
                                                </Label>
                                                <Input
                                                    type="text"
                                                    id="priority"
                                                    name="priority"
                                                    placeholder="Default: 5, Min: 1, Max: 10"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
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
                                                    type="text"
                                                    id="max_payment_days"
                                                    name="max_payment_days"
                                                    placeholder="30"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
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
                                                    type="text"
                                                    id="target_payment_days"
                                                    name="target_payment_days"
                                                    placeholder="7"
                                                    value={field.value ?? ""}
                                                    onChange={field.onChange}
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

                                    {/* <Controller
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
                                                    placeholder="e.g. Monday"
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
                                    /> */}
                                </div>

                                {/* RIGHT COLUMN: Address Info */}
                                <div className="space-y-6">
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
                                {/* {!id && (
                                    <>
                                        <div className="col-span-full">
                                            <Separator className="my-4" />
                                        </div>

                                        <div className="col-span-full">
                                            <h3 className="mb-4 text-lg font-medium">
                                                Supplier Documents
                                            </h3>
                                            <p className="mb-6 text-sm text-muted-foreground">
                                                Upload and manage documents
                                                related to this supplier.
                                            </p>
                                        </div>
                                        <DocumentFields
                                            control={control}
                                            documentVisibilityOptions={
                                                documentVisibilityOptions
                                            }
                                        />
                                    </>
                                )} */}

                                {id && (
                                    <div className="col-span-full">
                                        <Separator className="my-4" />
                                        <div className="p-5 mb-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                                        Supplier Contacts
                                                    </h4>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() =>
                                                            setIsDocsModalOpen(
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        Add Contacts
                                                    </Button>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <SupplierContactsTable
                                                        supplierId={id}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-5 mb-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                            <div>
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                                        Supplier Documents
                                                    </h4>
                                                    <div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() =>
                                                                setIsAddDocModalOpen(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            <PlusIcon className="w-4 h-4" />
                                                            Add Document
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <SupplierDocumentsTable
                                                        supplierId={id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
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

            <Modal
                isOpen={isDocsModalOpen}
                onClose={() => setIsDocsModalOpen(false)}
                className="max-w-5xl p-6 max-h-[90vh] overflow-y-auto"
            >
                <div className="px-4 py-2">
                    <div className="mt-4">
                        <AddSupplierContactsTable
                            supplierId={id}
                            setIsDocsModalOpen={setIsDocsModalOpen}
                        />
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isAddDocModalOpen}
                onClose={() => {
                    setIsAddDocModalOpen(false);
                    docForm.reset();
                }}
                className="max-w-3xl p-6 max-h-[90vh] overflow-y-auto"
            >
                <div className="px-4 py-2">
                    <h3 className="text-lg font-semibold mb-4">
                        Upload Document
                    </h3>
                    <form onSubmit={docForm.handleSubmit(handleAddDocument)}>
                        <DocumentFields
                            control={docForm.control}
                            documentVisibilityOptions={
                                documentVisibilityOptions
                            }
                        />

                        <div className="mt-4 flex justify-end gap-3">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    setIsAddDocModalOpen(false);
                                    docForm.reset();
                                }}
                                disabled={isUploadingDoc}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isUploadingDoc}>
                                {isUploadingDoc ? "Uploading..." : "Upload"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>

            <SupplierUserModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onUserCreated={async (user) => {
                    toast.success(
                        `User ${user?.contact?.firstname || ""} ${
                            user?.contact?.lastname || ""
                        } has been added!`,
                    );

                    const newContactId =
                        (user as unknown as { contact?: { id?: number } })
                            ?.contact?.id ??
                        (user as unknown as { contact_id?: number })
                            ?.contact_id;

                    await refetchContacts();
                    if (typeof newContactId === "number" && newContactId > 0) {
                        setValue("contact_id", newContactId, {
                            shouldDirty: true,
                            shouldValidate: true,
                        });
                    }
                }}
            />
        </>
    );
}
