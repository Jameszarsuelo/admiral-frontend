import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
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
    SupplierFormSchema,
} from "@/types/SupplierSchema";
import Select from "@/components/form/Select";
import Switch from "@/components/form/switch/Switch";
import { useAuth } from "@/hooks/useAuth";
import { fetchDocumentVisibilityList } from "@/database/document_visibility_api";
import { fetchContactList } from "@/database/contact_api";
import ContactFormModal from "@/components/modal/ContactFormModal";
import { Modal } from "@/components/ui/modal";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "lucide-react";
import Combobox from "@/components/form/Combobox";
import DocumentFields from "@/components/supplier/DocumentFields";
// import SupplierDocumentsTable from "./SupplierDocumentTable/SupplierDocumentsTable";
import AddSupplierContactsTable from "./SupplierContactsTable/AddSupplierContactsTable";
import SupplierContactsTable from "./SupplierContactsTable/SupplierContactTable";

// const countries = [
//     { code: "UK", label: "+44" },
//     { code: "PH", label: "+63" },
// ];
const twofaTypeOptions = [
    { value: 0, label: "SMS" },
    { value: 1, label: "Email" },
];

interface DocumentVisibilityOption {
    value: number;
    label: string;
}

export default function SupplierForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [documentVisibilityOptions, setDocumentVisibilityOptions] = useState<
        DocumentVisibilityOption[]
    >([]);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);

    // Fetch contacts for dropdown
    const { data: contacts = [], refetch: refetchContacts } = useQuery({
        queryKey: ["contacts"],
        queryFn: fetchContactList,
    });

    // Fetch current supplier data if editing
    const { data: supplierData, isLoading } = useQuery({
        queryKey: ["supplier", id],
        queryFn: () => (id ? fetchSupplierById(id) : null),
        enabled: !!id,
    });

    // Transform contacts to dropdown options
    const contactOptions = contacts
        .filter((contact) => Number(contact.type) === 2)
        .filter(
            (contact) =>
                contact.supplier_id === null ||
                contact.supplier_id === Number(id),
        )
        .map((contact) => ({
            value: contact.id || 0,
            label: `${contact.firstname} ${contact.lastname}`,
        }));

    const { handleSubmit, control, setError, reset } =
        useForm<ISupplierFormSchema>({
            defaultValues: {
                two_fa_enabled: false,
                two_fa_type: 0,
                sso_provider: "",
                sso_sub: "",
                name: "",
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
                created_by: user?.id,
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
            // Normalize null values to empty strings to prevent React warnings
            // Convert null to empty string for text inputs, undefined for optional fields
            const normalizedData = {
                ...supplierData,
                contact_id: supplierData.contact_id || undefined,
                updated_by: user?.id,
            };
            reset(normalizedData as ISupplierFormSchema);
        }
    }, [supplierData, reset, user]);

    function onSubmit(data: ISupplierFormSchema) {
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
            <PageBreadcrumb pageTitle="Supplier" />
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
                                                    Invoice Query Email
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
                                                    type="number"
                                                    id="priority"
                                                    name="priority"
                                                    placeholder="Default: 5, Min: 1, Max: 10"
                                                    min={1}
                                                    max={10}
                                                    value={field.value ?? ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
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
                                                    type="number"
                                                    id="max_payment_days"
                                                    name="max_payment_days"
                                                    placeholder="30"
                                                    value={field.value ?? ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
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
                                                    type="number"
                                                    id="target_payment_days"
                                                    name="target_payment_days"
                                                    placeholder="7"
                                                    value={field.value ?? ""}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ""
                                                                ? undefined
                                                                : Number(
                                                                      e.target
                                                                          .value,
                                                                  ),
                                                        )
                                                    }
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
                                    />
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
                                                        options={
                                                            twofaTypeOptions
                                                        }
                                                        placeholder="Select 2FA Type"
                                                        onChange={(
                                                            value: string,
                                                        ) =>
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
                                                        Multi-factor
                                                        authentication
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
                                {!id && (
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
                                )}

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

                                        {/* <div className="p-5 mb-4 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                                    Personal Information
                                                </h4>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <SupplierDocumentsTable />
                                                </div>
                                            </div>
                                        </div> */}
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

            <ContactFormModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
                onContactCreated={(contact) => {
                    console.log("Contact created:", contact);
                    toast.success(
                        `Contact ${contact.firstname} ${contact.lastname} has been added!`,
                    );
                    // Refetch contacts to update the dropdown
                    refetchContacts();
                }}
            />
        </>
    );
}
