import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { handleValidationErrors } from "@/helper/validationError";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import { useAuth } from "@/hooks/useAuth";
import {
    ContactCreateSchema,
    IContactCreateSchema,
} from "@/types/ContactSchema";
import { fetchContactById, upsertContact } from "@/database/contact_api";
import ContactFormFields from "@/components/form/contact/ContactFormFields";

export default function ContactForm() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    const { handleSubmit, control, reset, setError, formState } =
        useForm<IContactCreateSchema>({
            defaultValues: {
                id: undefined,
                salutation: "",
                firstname: "",
                lastname: "",
                phone: "",
                mobile: "+44",
                email: "",
                organisation: "",
                address_line_1: "",
                address_line_2: "",
                address_line_3: "",
                city: "",
                county: "",
                country: "United Kingdom",
                postcode: "",
                type: "1",
                created_by: user?.id,
            },
            resolver: zodResolver(ContactCreateSchema),
        });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            fetchContactById(id)
                .then((data) => {
                    const contactData = data as IContactCreateSchema;

                    reset({
                        ...contactData,
                        type: String(contactData.type),
                        address_line_2: contactData.address_line_2 || "",
                        address_line_3: contactData.address_line_3 || "",
                        city: contactData.city || "",
                        county: contactData.county || "",
                        postcode: contactData.postcode || "",
                        phone: contactData.phone || "",
                        mobile: contactData.mobile || "+44",
                        organisation: contactData.organisation || "",
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

    function onSubmit(data: IContactCreateSchema) {
        console.log("Submitted data:", data);
        toast.promise(upsertContact(data), {
            loading: id ? "Updating Contact..." : "Creating Contact...",
            success: () => {
                setTimeout(() => {
                    navigate(-1);
                }, 2000);
                return id
                    ? "Contact updated successfully!"
                    : "Contact created successfully!";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Contact" : "Add Contact"}
                pageBreadcrumbs={[
                    { title: "Contact Directory", link: "/contact-directory" },
                ]}
            />
            <ComponentCard title={id ? "Edit Contact" : "Add Contact"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-contact" onSubmit={handleSubmit(onSubmit)}>
                        <ContactFormFields
                            control={control}
                            errors={formState.errors}
                        />
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

                        <Button type="submit" form="form-contact">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
