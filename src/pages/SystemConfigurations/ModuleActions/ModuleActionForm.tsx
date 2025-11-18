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

type ModuleActionFormValues = {
    id?: number;
    name: string;
    code?: string;
    module?: string;
};

export default function ModuleActionForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset } = useForm<ModuleActionFormValues>({
        defaultValues: { id: undefined, name: "", code: "", module: "" },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api
                .get(`/api/module-actions/${id}`)
                .then((res) => reset(res.data as ModuleActionFormValues))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id, reset]);

    async function onSubmit(data: ModuleActionFormValues) {
        try {
            setIsLoading(true);
            await toast.promise(
                id ? api.put(`/api/module-actions/${id}`, data) : api.post(`/api/module-actions`, data),
                {
                    loading: id ? "Updating Action..." : "Creating Action...",
                    success: () => {
                        setTimeout(() => navigate("/module-actions"), 800);
                        return id ? "Action updated" : "Action created";
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
            <PageBreadcrumb pageTitle="Module Action" />
            <ComponentCard title={id ? "Edit Module Action" : "Add Module Action"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-module-action" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input {...field} id="name" placeholder="Enter action name" />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="code"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="code">Code</Label>
                                            <Input {...field} id="code" placeholder="Unique code" />
                                        </div>
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="module"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="module">Module</Label>
                                            <Input {...field} id="module" placeholder="Module code" />
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
                        <Button type="submit" form="form-module-action">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
