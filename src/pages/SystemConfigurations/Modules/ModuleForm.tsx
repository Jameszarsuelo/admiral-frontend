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

type ModuleFormValues = {
    id?: number;
    name: string;
    code?: string;
    path?: string;
};

export default function ModuleForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const { handleSubmit, control, reset } = useForm<ModuleFormValues>({
        defaultValues: { id: undefined, name: "", code: "", path: "" },
    });

    useEffect(() => {
        if (id) {
            setIsLoading(true);
            api
                .get(`/api/modules/${id}`)
                .then((res) => reset(res.data as ModuleFormValues))
                .catch((err) => console.error(err))
                .finally(() => setIsLoading(false));
        }
    }, [id, reset]);

    async function onSubmit(data: ModuleFormValues) {
        try {
            setIsLoading(true);
            await toast.promise(
                id ? api.put(`/api/modules/${id}`, data) : api.post(`/api/modules`, data),
                {
                    loading: id ? "Updating Module..." : "Creating Module...",
                    success: () => {
                        setTimeout(() => navigate("/modules"), 800);
                        return id ? "Module updated" : "Module created";
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
            <PageBreadcrumb pageTitle="Module" />
            <ComponentCard title={id ? "Edit Module" : "Add Module"}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <form id="form-module" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input {...field} id="name" placeholder="Enter module name" />
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
                                    name="path"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <Label htmlFor="path">Path</Label>
                                            <Input {...field} id="path" placeholder="Route path e.g. /foo" />
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
                        <Button type="submit" form="form-module">
                            Save
                        </Button>
                    </div>
                )}
            </ComponentCard>
        </>
    );
}
