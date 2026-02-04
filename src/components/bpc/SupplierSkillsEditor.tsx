import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import ComponentCard from "@/components/common/ComponentCard";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";

import {
    fetchBpcSupplierSkills,
    upsertBpcSupplierSkills,
} from "@/database/bpc_supplier_skills_api";
import type { IBpcSupplierSkillRow } from "@/types/BpcSupplierSkillSchema";
import { fetchBpcOptions } from "@/database/bpc_api";

function clampSkill(value: number): number {
    if (Number.isNaN(value)) return 0;
    return Math.min(100, Math.max(0, Math.trunc(value)));
}

export default function SupplierSkillsEditor({
    bpcId,
    title = "Supplier Skills (SBR)",
}: {
    bpcId?: number;
    title?: string;
}) {
    const navigate = useNavigate();

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useQuery<IBpcSupplierSkillRow[]>({
        queryKey: ["bpc-supplier-skills", bpcId ?? "me"],
        queryFn: () => fetchBpcSupplierSkills(bpcId),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    });

    const errorMessage =
        (error as { message?: string } | undefined)?.message ??
        (typeof error === "string" ? error : undefined);

    const shouldShowBpcPicker =
        !bpcId && isError && errorMessage === "BPC not found for current user.";

    const {
        data: bpcs,
        isLoading: isLoadingBpcs,
        isError: isErrorBpcs,
        error: bpcsError,
        refetch: refetchBpcs,
    } = useQuery<{ value: number; label: string }[]>({
        queryKey: ["bpc-options"],
        queryFn: fetchBpcOptions,
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled: shouldShowBpcPicker,
    });

    const [draft, setDraft] = useState<Record<number, number>>({});

    useEffect(() => {
        if (!data) return;
        const next: Record<number, number> = {};
        for (const row of data) {
            next[row.id] = clampSkill(row.skill ?? 0);
        }
        setDraft(next);
    }, [data]);

    const originalSkillMap = useMemo(() => {
        const map: Record<number, number> = {};
        for (const row of data || []) {
            map[row.id] = clampSkill(row.skill ?? 0);
        }
        return map;
    }, [data]);

    const rows = useMemo(() => {
        return (data || []).map((r) => ({
            ...r,
            skill: draft[r.id] ?? clampSkill(r.skill ?? 0),
        }));
    }, [data, draft]);

    const columns: ColumnDef<IBpcSupplierSkillRow>[] = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Supplier",
                cell: ({ row }) => (
                    <span className="text-sm text-gray-800 dark:text-gray-100">
                        {row.original.name}
                    </span>
                ),
            },
            {
                id: "skill",
                header: "Skill (0-100)",
                accessorFn: (r) => r.skill,
                cell: ({ row }) => {
                    const supplierId = row.original.id;
                    const value = draft[supplierId] ?? clampSkill(row.original.skill ?? 0);

                    return (
                        <div className="max-w-[180px]">
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={String(value)}
                                onChange={(e) => {
                                    const next = clampSkill(Number(e.target.value));
                                    setDraft((prev) => ({
                                        ...prev,
                                        [supplierId]: next,
                                    }));
                                }}
                            />
                        </div>
                    );
                },
            },
        ],
        [draft],
    );

    const mutation = useMutation({
        mutationFn: (payload: { skills: { supplier_id: number; skill: number }[] }) =>
            upsertBpcSupplierSkills(payload, bpcId),
        onSuccess: async (res) => {
            toast.success(res.message ?? "Supplier skills updated");
            await refetch();
        },
        onError: (err: unknown) => {
            console.error("SupplierSkills save error:", err);
            toast.error("Failed to update supplier skills");
        },
    });

    const onSave = () => {
        const changed = (data || [])
            .map((r) => {
                const nextSkill = clampSkill(draft[r.id] ?? r.skill ?? 0);
                const prevSkill = originalSkillMap[r.id] ?? 0;
                return {
                    supplier_id: r.id,
                    nextSkill,
                    prevSkill,
                };
            })
            .filter((x) => x.nextSkill !== x.prevSkill)
            .map((x) => ({ supplier_id: x.supplier_id, skill: x.nextSkill }));

        if (changed.length === 0) {
            toast.message("No changes to save");
            return;
        }

        const payload = { skills: changed };

        toast.promise(mutation.mutateAsync(payload), {
            loading: "Saving supplier skills...",
            success: "Saved",
            error: "Save failed",
        });
    };

    return (
        <ComponentCard title={title}>
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Spinner size="lg" />
                </div>
            ) : shouldShowBpcPicker ? (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        This screen is in Admin view. Select a BPC to edit Supplier Skills (SBR).
                    </p>

                    {isLoadingBpcs ? (
                        <div className="flex items-center justify-center py-12">
                            <Spinner size="lg" />
                        </div>
                    ) : isErrorBpcs ? (
                        <div className="space-y-3">
                            <p className="text-sm text-error-500">
                                Failed to load BPC list.
                            </p>
                            <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                                {(() => {
                                    try {
                                        return JSON.stringify(bpcsError, null, 2);
                                    } catch {
                                        return String(bpcsError);
                                    }
                                })()}
                            </pre>
                            <Button size="sm" onClick={() => refetchBpcs()}>
                                Retry
                            </Button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border border-gray-200 dark:border-gray-800 rounded-lg">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                            BPC
                                        </th>
                                        <th className="p-3 w-[140px]" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {(bpcs || []).map((bpc) => (
                                        <tr
                                            key={bpc.value}
                                            className="border-t border-gray-200 dark:border-gray-800"
                                        >
                                            <td className="p-3 text-sm text-gray-800 dark:text-gray-100">
                                                {bpc.label}
                                            </td>
                                            <td className="p-3 text-right">
                                                <Button
                                                    size="sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/bpc-supplier-skills/view/${bpc.value}`,
                                                        )
                                                    }
                                                >
                                                    View
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : isError ? (
                <div className="space-y-3">
                    <p className="text-sm text-error-500">
                        Failed to load supplier skills.
                    </p>
                    <pre className="text-xs text-gray-500 dark:text-gray-400 whitespace-pre-wrap">
                        {(() => {
                            try {
                                return JSON.stringify(error, null, 2);
                            } catch {
                                return String(error);
                            }
                        })()}
                    </pre>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Set a skill value from 0 to 100 per supplier. A value of 0 means
                        you will never be presented activities for that supplier.
                    </p>

                    <div className="flex items-center justify-between gap-3">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Showing {rows.length} supplier(s)
                            {isFetching ? " (refreshing...)" : ""}
                        </p>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => refetch()} size="sm">
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[800px] xl:min-w-full px-2">
                            <DataTable columns={columns} data={rows} />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!data) return;
                                const next: Record<number, number> = {};
                                for (const row of data) {
                                    next[row.id] = clampSkill(row.skill ?? 0);
                                }
                                setDraft(next);
                            }}
                            disabled={mutation.isPending}
                        >
                            Reset
                        </Button>
                        <Button onClick={onSave} disabled={mutation.isPending}>
                            {mutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            )}
        </ComponentCard>
    );
}
