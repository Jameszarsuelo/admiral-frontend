import Can from "@/components/auth/Can";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { FieldGroup, Field } from "@/components/ui/field";
import { fetchDepartment, upsertDepartment } from "@/database/department_api";
import { handleValidationErrors } from "@/helper/validationError";
import { DepartmentSchema, IDepartmentForm } from "@/types/DepartmentSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@radix-ui/react-label";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";

const DepartmentForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<IDepartmentForm>({
        defaultValues: {
            department: "",
        },
        resolver: zodResolver(DepartmentSchema),
    });

    useEffect(() => {
        if (id) {
            fetchDepartment(id).then((data) => {
                reset({
                    department: data.department || "",
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || "",
                });
            });
        }
    }, [id, reset]);

    const onSubmit = async (departmentData: IDepartmentForm) => {
        try {
            const payload = id ? { ...departmentData, id: Number(id) } : departmentData;
            toast.promise(upsertDepartment(payload), {
                loading: id ? "Updating Department ..." : "Creating Department ...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/departments`);
                    }, 2000);
                    return id
                        ? "Department updated successfully"
                        : "Department created successfully";
                },
                error: (error: unknown) => {
                    return handleValidationErrors(error, setError);
                },
            });
        } catch (error) {
            console.log("Error upon Submitting", error);
        }
    };

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Department" : "Add Department"}
                pageBreadcrumbs={[{ title: "Departments", link: "/departments" }]}
            />
            <ComponentCard title={id ? "Edit Department" : "Add Department"}>
                <form id="form-department" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 gap-1 mt-5">
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="department">
                                                Department
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="department"
                                                name="department"
                                                placeholder="Enter Department"
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
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="danger" onClick={() => navigate("/departments")}>Cancel</Button>
                    <Button variant="outline" onClick={() => reset()}>Reset</Button>
                    <Can permission={id ? "departments.edit" : "departments.create"}>
                        <Button type="submit" form="form-department">
                            {id ? "Update" : "Submit"}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    );
};

export default DepartmentForm;
