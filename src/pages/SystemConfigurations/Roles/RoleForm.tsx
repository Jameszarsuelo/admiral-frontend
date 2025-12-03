import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { ColumnDef } from "@tanstack/react-table";
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
import { DataTable } from "@/components/ui/DataTable";
import { IRoleForm } from "@/types/RoleSchema";
import { handleValidationErrors } from "@/helper/validationError";
import { usePermissions } from "@/hooks/usePermissions";

type MAItem = {
    id?: number;
    module_id?: number;
    action?: string;
    code?: string;
};

export default function RoleForm() {
    const { id } = useParams();
    const nav = useNavigate();

    const { reload } = usePermissions();

    const { control, handleSubmit, reset, getValues, setValue, setError } =
        useForm<IRoleForm>({
            defaultValues: {
                id: undefined,
                name: "",
                code: "",
                module_actions: [],
            },
        });

    const { fields, append, remove } = useFieldArray<
        IRoleForm,
        "module_actions"
    >({
        control,
        name: "module_actions",
    });

    // Local left-side form state for adding/editing a single module-action
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [leftModuleId, setLeftModuleId] = useState<number | undefined>(
        undefined
    );
    const [leftActionId, setLeftActionId] = useState<number | undefined>(
        undefined
    );
    const [leftCode, setLeftCode] = useState<string>("");

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
                })
            )
            .catch(console.error);
    }, [id, reset]);

    const moduleOptions = (
        (modulesQ.data as IModuleBase[] | undefined) ?? []
    ).map((m) => ({ value: Number(m.id), label: m.name }));

    const moduleMap = useMemo(() => {
        return ((modulesQ.data as IModuleBase[] | undefined) ?? []).reduce(
            (acc, m) => ({ ...acc, [String(m.id)]: m.name }),
            {} as Record<string, string>
        );
    }, [modulesQ.data]);

    // removed inline row helpers — left/right UI will manage add/update/remove

    // Action options grouped by module id for left form
    const actionsByModule = useMemo(() => {
        const list = (
            (actionsQ.data as IModuleActionBase[] | undefined) ?? []
        ).reduce((acc: Record<number, IModuleActionBase[]>, a) => {
            const k = Number(a.module_id) || 0;
            acc[k] = acc[k] || [];
            acc[k].push(a);
            return acc;
        }, {});
        return list;
    }, [actionsQ.data]);

    function resetLeftFields() {
        setEditingIndex(null);
        setLeftModuleId(undefined);
        setLeftActionId(undefined);
        setLeftCode("");
    }

    function loadRowToLeft(idx: number) {
        const cur = (getValues("module_actions") ?? []) as MAItem[];
        const row = cur[idx];
        if (!row) return;
        setEditingIndex(idx);
        setLeftModuleId(row.module_id ?? undefined);
        setLeftActionId(row.id ?? undefined);
        setLeftCode(row.code ?? "");
        // scroll into view of left form for better UX
        requestAnimationFrame(() => {
            const el = document.getElementById("left-action-form");
            el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
    }

    function handleAddOrUpdate() {
        const payload: MAItem = {
            id: leftActionId,
            module_id: leftModuleId,
            action: actionsByModule[leftModuleId ?? 0]?.find(
                (a) => a.id === leftActionId
            )?.action,
            code: leftCode,
        };

        if (editingIndex === null) {
            append(payload as FormMA);
            resetLeftFields();
        } else {
            const cur = (getValues("module_actions") ?? []) as MAItem[];
            cur[editingIndex] = { ...(cur[editingIndex] ?? {}), ...payload };
            setValue(
                "module_actions",
                cur as unknown as IRoleForm["module_actions"]
            );
            resetLeftFields();
        }
    }

    function handleRemove(idx: number) {
        remove(idx);
        // if we were editing this row, clear the left fields
        if (editingIndex === idx) resetLeftFields();
    }

    async function onSubmit(data: IRoleForm) {
        // perform save
        await toast.promise(upsertRole(data), {
            loading: id ? "Updating Role..." : "Creating Role...",
            success: () => (id ? "Role updated" : "Role created"),
            error: (error: unknown) => {
                return handleValidationErrors(error, setError);
            },
        });

        // refresh permissions so any changes to role/actions are reflected
        try {
            await new Promise((r) => setTimeout(r, 1000)); // 400 ms
            await reload?.();
        } catch (err) {
            // non-fatal; log and continue to navigation
            console.error("Failed to reload permissions:", err);
        }

        nav("/roles");
    }

    return (
        <>
            <PageBreadcrumb
                pageTitle={id ? "Edit Role" : "Add Role"}
                pageBreadcrumbs={[{ title: "Roles", link: "/roles" }]}
            />
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
                        <h4 className="text-lg font-medium mb-4">
                            Module Actions
                        </h4>

                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                            <div id="left-action-form" className="col-span-1">
                                <Field>
                                    <Label>Module</Label>
                                    <Combobox
                                        value={leftModuleId ?? undefined}
                                        options={moduleOptions}
                                        onChange={(v) => {
                                            const modId = Number(v);
                                            setLeftModuleId(modId);
                                            // clear action selection when module changes
                                            setLeftActionId(undefined);
                                            setLeftCode("");
                                        }}
                                        placeholder="Select Module"
                                        searchPlaceholder="Search module..."
                                        emptyText="No module found."
                                    />
                                </Field>

                                <div className="mt-4">
                                    <Label>Action</Label>
                                    <Select
                                        options={(
                                            actionsByModule[
                                                leftModuleId ?? 0
                                            ] ?? []
                                        ).map((a) => ({
                                            value: String(a.id),
                                            label: a.action,
                                        }))}
                                        value={String(leftActionId ?? "")}
                                        onChange={(val) => {
                                            const actionId = Number(val);
                                            setLeftActionId(actionId);
                                            const ma = (
                                                actionsByModule[
                                                    leftModuleId ?? 0
                                                ] ?? []
                                            ).find((x) => x.id === actionId);
                                            setLeftCode(ma?.code ?? "");
                                        }}
                                    />
                                </div>

                                <div className="mt-4">
                                    <Label>Code</Label>
                                    <Input
                                        value={leftCode}
                                        onChange={(e) =>
                                            setLeftCode(e.target.value)
                                        }
                                        placeholder="e.g. users.create"
                                        disabled
                                    />
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={handleAddOrUpdate}
                                    >
                                        {editingIndex === null
                                            ? "Add"
                                            : "Update"}
                                    </Button>
                                    {editingIndex !== null && (
                                        <Button
                                            size="sm"
                                            variant="danger"
                                            onClick={resetLeftFields}
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="col-span-2">
                                <div className="max-w-full overflow-x-auto custom-scrollbar">
                                    <div className="min-w-[600px] px-2">
                                        <DataTable
                                            columns={getTableColumns({
                                                moduleMap,
                                                onEdit: loadRowToLeft,
                                                onRemove: handleRemove,
                                            })}
                                            data={fields as unknown as MAItem[]}
                                        />
                                    </div>
                                </div>
                            </div>
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

type TableColsOpts = {
    moduleMap: Record<string, string>;
    onEdit: (idx: number) => void;
    onRemove: (idx: number) => void;
};

type FormMA = NonNullable<IRoleForm["module_actions"]>[number];

function getTableColumns(opts: TableColsOpts) {
    const { moduleMap, onEdit, onRemove } = opts;
    const columns: ColumnDef<MAItem>[] = [
        {
            accessorKey: "module_id",
            header: "Module",
            cell: (info) => moduleMap[String(info.getValue())] ?? "-",
        },
        { accessorKey: "action", header: "Action" },
        { accessorKey: "code", header: "Code" },
        {
            id: "actions",
            header: "",
            cell: (info) => {
                const idx = info.row.index;
                return (
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={() => onEdit(idx)}>
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="danger"
                            onClick={() => onRemove(idx)}
                        >
                            Remove
                        </Button>
                    </div>
                );
            },
        },
    ];
    return columns;
}
