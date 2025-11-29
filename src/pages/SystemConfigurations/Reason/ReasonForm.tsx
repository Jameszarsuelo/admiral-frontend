import Can from '@/components/auth/Can';
import ComponentCard from '@/components/common/ComponentCard';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import Input from '@/components/form/input/InputField';
import Radio from '@/components/form/input/Radio';
import Button from '@/components/ui/button/Button';
import { Field, FieldGroup } from '@/components/ui/field';
import { fetchReason, upsertReason } from '@/database/reason_api';
import { handleValidationErrors } from '@/helper/validationError';
import { IReasonForm, ReasonSchema } from '@/types/ReasonSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Label } from '@radix-ui/react-label';
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router'
import { toast } from 'sonner';

const ReasonForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { handleSubmit, control, setError, reset } = useForm<IReasonForm>({
        defaultValues: {
            reason: "",
            reason_for: "1",
        },
        resolver: zodResolver(ReasonSchema)
    });

    useEffect(() => {
        if (id) {
            fetchReason(id).then((data) => {
                reset({
                    reason: data.reason || "",
                    reason_for: String(data.reason_for) as "1" | "2" | "3",
                    created_at: data.created_at || "",
                    updated_at: data.updated_at || "",
                })
            })
        }
    }, [id, reset])

    const onSubmit = async (reasonData: IReasonForm) => {
        try {
            const payload = id ? { ...reasonData, id: Number(id) } : reasonData;
            toast.promise(upsertReason(payload), {
                loading: id ? "Updating Reason ..." : "Creating Reason ...",
                success: () => {
                    setTimeout(() => {
                        navigate(`/reason`);
                    }, 2000);
                    return id ? "Reason updated successfully" : "Reason created successfully"
                },
                error: (error: unknown) => {
                    return handleValidationErrors(error, setError);
                }
            })
        } catch (error) {
            console.log("Error upon Submitting", error);
        }
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Reason" />
            <ComponentCard title={id ? "Edit Reason" : "Add Reason"}>
                <form id="form-reason" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 mt-5">
                                <Controller
                                    name="reason_for"                                 control={control}
                                    render={({ field }) => (
                                        <div className="grid">
                                            <Label>
                                                Reason For
                                            </Label>
                                            <div className="flex gap-8 mt-3">
                                                <Radio
                                                    id="reason_for_process"
                                                    value={1}
                                                    checked={field.value == "1"}
                                                    onChange={() =>
                                                        field.onChange("1")
                                                    }
                                                    label="Process Now"
                                                    name={""}
                                                />
                                                <Radio
                                                    id="reason_for_close"
                                                    value={2}
                                                    checked={field.value == "2"}
                                                    onChange={() =>
                                                        field.onChange("2")
                                                    }
                                                    label="Close"
                                                    name={""}
                                                />
                                                 <Radio
                                                    id="reason_for_outcome"
                                                    value={3}
                                                    checked={field.value == "3"}
                                                    onChange={() =>
                                                        field.onChange("3")
                                                    }
                                                    label="Outcome"
                                                    name={""}
                                                />
                                            </div>
                                        </div>
                                    )}
                                />
                                
                            </div>
                            

                            <div className="col-span-4 gap-1 mt-5">
                                <Controller
                                    name="reason"
                                    control={control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Reason
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="reason"
                                                placeholder="Enter Reason"
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
                    <Button
                        variant="danger"
                        onClick={() => navigate("/reason")}
                    >
                        Cancel
                    </Button>
                    <Button variant="outline" onClick={() => reset()}>
                        Reset
                    </Button>
                    <Can permission={id ? 'reason.edit' : 'reason.create'}>
                        <Button type="submit" form="form-reason">
                            {id ? 'Update' : 'Submit'}
                        </Button>
                    </Can>
                </div>
            </ComponentCard>
        </>
    )
}

export default ReasonForm
