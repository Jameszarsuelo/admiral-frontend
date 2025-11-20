import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
// import Spinner from "@/components/ui/spinner/Spinner";
import { fetchRoleById, upsertRole } from "@/database/roles_api";
import { useQuery } from "@tanstack/react-query";
import Combobox from "@/components/form/Combobox";
import { Field } from "@/components/ui/field";
import { fetchModuleList } from "@/database/module_api";
import { IModuleBase } from "@/types/ModuleSchema";
import { fetchModuleActionList } from "@/database/module_actions_api";
import { IModuleActionBase } from "@/types/ModuleActionSchema";
import Select from "@/components/form/Select";
import { IRoleForm } from "@/types/RoleSchema";
import { handleValidationErrors } from "@/helper/validationError";

type MAItem = {
    id?: number;
    module_id?: number;
    action?: string;
    code?: string;
};

export default function RoleForm() {
    const { id } = useParams();
    const nav = useNavigate();

    const { control, handleSubmit, reset, getValues, setValue, setError } =
        useForm<IRoleForm>({
            defaultValues: {
                id: undefined,
                name: "",
                code: "",
                module_actions: [],
            },
        });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "module_actions",
    });

    const modulesQ = useQuery({
        queryKey: ["modules-list"],
        queryFn: fetchModuleList,
        staleTime: 300000,
    });
    const actionsQ = useQuery({
        queryKey: ["module-actions-list"],
        queryFn: fetchModuleActionList,
        staleTime: 300000,
    });

    useEffect(() => {
        if (!id) return;
        fetchRoleById(id)
            .then((d) =>
                reset({
                    id: d.id,
                    name: d.name ?? "",
                    code: d.code ?? "",
                    module_actions: (d.module_actions ?? []).map((m) => ({
                        id: m.id,
                        module_id: m.module_id,
                        action: m.action,
                        code: m.code,
                    })),
                }),
            )
            .catch(console.error);
    }, [id, reset]);

    const moduleOptions = (
        (modulesQ.data as IModuleBase[] | undefined) ?? []
    ).map((m) => ({ value: Number(m.id), label: m.name }));

    function updateRow(idx: number, patch: Partial<MAItem>) {
        const cur = (getValues("module_actions") ?? []) as MAItem[];
        cur[idx] = { ...(cur[idx] ?? {}), ...patch };
        setValue(
            "module_actions",
            cur as unknown as IRoleForm["module_actions"],
        );
    }

    function onModuleChange(idx: number, modId: number) {
        updateRow(idx, {
            module_id: modId,
            id: undefined,
            action: "",
            code: "",
        });
    }

    function onActionSelect(idx: number, actionId: number) {
        const ma = (
            (actionsQ.data as IModuleActionBase[] | undefined) ?? []
        ).find((x) => x.id === actionId);
        if (!ma) return;
        updateRow(idx, {
            id: ma.id,
            module_id: ma.module_id,
            action: ma.action,
            code: ma.code,
        });
    }

    async function onSubmit(data: IRoleForm) {
        await toast.promise(upsertRole(data), {
            loading: id ? "Updating Role..." : "Creating Role...",
            success: () => {
                nav("/roles");
                return id ? "Role updated" : "Role created";
            },
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Role" />
            <ComponentCard title={id ? "Edit Role" : "Add Role"}>
                <form id="form-role" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        {...field}
                                        id="name"
                                        placeholder="Enter role name"
                                    />
                                </div>
                            )}
                        />

                        <Controller
                            name="code"
                            control={control}
                            render={({ field }) => (
                                <div>
                                    <Label htmlFor="code">Code</Label>
                                    <Input
                                        {...field}
                                        id="code"
                                        placeholder="Enter role code (e.g. admin_master)"
                                    />
                                </div>
                            )}
                        />
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium">
                                Module Actions
                            </h4>
                            <Button
                                size="sm"
                                onClick={() =>
                                    append({
                                        module_id: 0,
                                        action: "",
                                        code: "",
                                    })
                                }
                            >
                                Add Action
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {fields.map((f, i) => {
                                const moduleId = (getValues("module_actions") ??
                                    [])[i]?.module_id as number | undefined;
                                const actionOptions = (
                                    (actionsQ.data as
                                        | IModuleActionBase[]
                                        | undefined) ?? []
                                )
                                    .filter((a) => a.module_id === moduleId)
                                    .map((a) => ({
                                        value: String(a.id),
                                        label: a.action,
                                    }));
                                return (
                                    <div
                                        key={f.id ?? i}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-3 items-end"
                                    >
                                        <Controller
                                            name={
                                                `module_actions.${i}.module_id` as const
                                            }
                                            control={control}
                                            render={({ field }) => (
                                                <Field>
                                                    <Label>Module</Label>
                                                    <Combobox
                                                        value={
                                                            field.value ??
                                                            undefined
                                                        }
                                                        options={moduleOptions}
                                                        onChange={(v) => {
                                                            const modId =
                                                                Number(v);
                                                            field.onChange(
                                                                modId,
                                                            );
                                                            onModuleChange(
                                                                i,
                                                                modId,
                                                            );
                                                        }}
                                                        placeholder="Select Module"
                                                        searchPlaceholder="Search module..."
                                                        emptyText="No module found."
                                                    />
                                                </Field>
                                            )}
                                        />

                                        <div>
                                            <Label>Action</Label>
                                            <Controller
                                                name={
                                                    `module_actions.${i}.id` as const
                                                }
                                                control={control}
                                                render={({ field }) => (
                                                    <Select
                                                        options={actionOptions}
                                                        value={String(
                                                            field.value ?? "",
                                                        )}
                                                        onChange={(val) => {
                                                            const id =
                                                                Number(val);
                                                            field.onChange(id);
                                                            onActionSelect(
                                                                i,
                                                                id,
                                                            );
                                                        }}
                                                    />
                                                )}
                                            />
                                        </div>

                                        <Controller
                                            name={
                                                `module_actions.${i}.code` as const
                                            }
                                            control={control}
                                            render={({ field }) => (
                                                <div>
                                                    <Label>Code</Label>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g. users.create"
                                                        disabled
                                                    />
                                                </div>
                                            )}
                                        />

                                        <div className="mt-6">
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => remove(i)}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button variant="danger" onClick={() => nav(-1)}>
                                Cancel
                            </Button>
                            <Button type="submit" form="form-role">
                                Save
                            </Button>
                        </div>
                    </div>
                </form>
            </ComponentCard>
        </>
    );
}
