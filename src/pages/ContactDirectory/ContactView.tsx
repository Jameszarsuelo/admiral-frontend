import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Spinner from "@/components/ui/spinner/Spinner";
import { fetchContactById } from "@/database/contact_api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import Button from "@/components/ui/button/Button";

export default function ContactView() {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: contactData, isLoading } = useQuery({
        queryKey: ["contact-data", id],
        queryFn: async () => {
            // Replace with actual fetch function
            return await fetchContactById(id!);
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Spinner size="md" />
            </div>
        );
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle="View Contact"
                pageBreadcrumbs={[
                    { title: "Contact Directory", link: "/contact-directory" },
                ]}
            />
            <ComponentCard title="Contact Information">
                <div>
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
                        <div className="space-y-6">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Salutation
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90 capitalize">
                                    {contactData?.salutation}.
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    First Name
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.firstname}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Last Name
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.lastname}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Landline Phone Number
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.phone}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Mobile Phone Number
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.mobile}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Email
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.email}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Contact Type
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData
                                        ? contactData.type == "1"
                                            ? "Contact"
                                            : contactData.type == "2"
                                            ? "Supplier"
                                            : "User"
                                        : ""}
                                </p>
                            </div>

                            {/* <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Supplier
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    
                                </p>
                            </div> */}
                        </div>

                        <div className="space-y-6">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Organisation
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.organisation}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Address
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.address_line_1}
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.address_line_2}
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.address_line_3}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    City / Town
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.city}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    County
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.county}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Country
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.country}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Postcode
                                </p>
                                <p className="text-md font-medium text-gray-800 dark:text-white/90">
                                    {contactData?.postcode}
                                </p>
                            </div>
                        </div>
                    </div>
                     {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="primary" onClick={() => navigate(`/contact-directory`)}>
                            Back to Contact Directory
                        </Button>
                    </div>
                     )}
                </div>
            </ComponentCard>
        </>
    );
}
