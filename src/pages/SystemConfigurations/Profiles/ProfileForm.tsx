import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import Spinner from "@/components/ui/spinner/Spinner";
import api from "@/database/api";

type ProfileFormValues = {
    id?: number;
    name: string;
    description?: string;
};

export default function ProfileForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset } = useForm<ProfileFormValues>({
        defaultValues: {
            id: undefined,
            name: "",
            description: "",
        },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api
                .get(`/api/profiles/${id}`)
                .then((res) => {
                    reset({ ...(res.data as ProfileFormValues) });
                })
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id, reset]);

    async function onSubmit(data: ProfileFormValues) {
        try {
            setIsLoading(true);
            await toast.promise(
                id ? api.put(`/api/profiles/${id}`, data) : api.post(`/api/profiles`, data),
                {
                    loading: id ? "Updating Profile..." : "Creating Profile...",
                    success: () => {
                        setTimeout(() => navigate("/profiles"), 800);
                        return id ? "Profile updated" : "Profile created";
                    },
                    error: (e: any) => e?.message || "An error occurred",
                },
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Profile" />
            <ComponentCard title={id ? "Edit Profile" : "Add Profile"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-profile" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input {...field} id="name" placeholder="Enter profile name" />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Input {...field} id="description" placeholder="Enter description" />
                                        </div>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                )}

                {!isLoading && (
                    <div className="mt-6 flex justify-end gap-3">
                        <Button variant="danger" onClick={() => navigate(-1)}>
                            Cancel
                        </Button>
                        <Button type="submit" form="form-profile">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
