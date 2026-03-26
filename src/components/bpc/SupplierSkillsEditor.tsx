import { useCallback, useEffect, useMemo, useState } from "react";
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

type DraftRow = {
    skill: string;
    trained: boolean;
    paused: boolean;
};

function defaultDraftRow(row?: IBpcSupplierSkillRow): DraftRow {
    return {
        skill: String(clampSkill(row?.skill ?? 0)),
        trained: row?.trained === undefined ? true : Boolean(row.trained),
        paused: row?.paused === undefined ? true : Boolean(row.paused),
    };
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
        queryFn: () => fetchBpcOptions(),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled: shouldShowBpcPicker,
    });

    const [draft, setDraft] = useState<Record<number, DraftRow>>({});

    const handleDraftChange = useCallback((supplierId: number, raw: string) => {
        const digitsOnly = raw.replace(/[^0-9]/g, "");

        if (digitsOnly === "") {
            setDraft((prev) => ({
                ...prev,
                [supplierId]: {
                    ...(prev[supplierId] ?? defaultDraftRow()),
                    skill: "",
                },
            }));
            return;
        }

        const clamped = clampSkill(Number(digitsOnly));
        setDraft((prev) => ({
            ...prev,
            [supplierId]: {
                ...(prev[supplierId] ?? defaultDraftRow()),
                skill: String(clamped),
            },
        }));
    }, []);

    const handleDraftBlur = useCallback((supplierId: number) => {
        setDraft((prev) => {
            const current = prev[supplierId] ?? defaultDraftRow();

            if (current.skill === "") {
                return {
                    ...prev,
                    [supplierId]: { ...current, skill: "0" },
                };
            }

            const normalized = String(clampSkill(Number(current.skill)));
            if (normalized === current.skill) return prev;
            return {
                ...prev,
                [supplierId]: { ...current, skill: normalized },
            };
        });
    }, []);

    useEffect(() => {
        if (!data) return;
        const next: Record<number, DraftRow> = {};
        for (const row of data) {
            next[row.id] = defaultDraftRow(row);
        }
        setDraft(next);
    }, [data]);

    const originalRowMap = useMemo(() => {
        const map: Record<number, DraftRow> = {};
        for (const row of data || []) {
            map[row.id] = defaultDraftRow(row);
        }
        return map;
    }, [data]);

    type TSupplierSkillRow = IBpcSupplierSkillRow & {
        draftSkill: string;
        draftTrained: boolean;
        draftPaused: boolean;
    };

    const rows = useMemo((): TSupplierSkillRow[] => {
        return (data || []).map((r) => {
            const current = draft[r.id] ?? defaultDraftRow(r);
            const effectiveNumeric = current.trained
                ? clampSkill(Number(current.skill === "" ? 0 : current.skill))
                : 0;

            return {
                ...r,
                draftSkill: current.trained ? current.skill : "0",
                draftTrained: current.trained,
                draftPaused: current.paused,
                skill: effectiveNumeric,
            };
        });
    }, [data, draft]);

    const allPaused = useMemo(() => {
        const trainedRows = rows.filter((row) => row.draftTrained);
        if (trainedRows.length === 0) {
            return false;
        }

        return trainedRows.every((row) => row.draftPaused);
    }, [rows]);

    const updateDraftRow = useCallback(
        (
            supplierId: number,
            updater: (current: DraftRow) => DraftRow,
        ) => {
            setDraft((prev) => {
                const current = prev[supplierId] ?? defaultDraftRow();
                return {
                    ...prev,
                    [supplierId]: updater(current),
                };
            });
        },
        [],
    );

    const exportCsv = useCallback(() => {
        const csvEscape = (value: unknown) => {
            const normalized =
                value === null || value === undefined
                    ? ""
                    : typeof value === "string"
                      ? value
                      : typeof value === "number" || typeof value === "boolean"
                        ? String(value)
                        : JSON.stringify(value);

            const needsQuotes = /[\n\r,"]/.test(normalized);
            const escaped = normalized.replace(/"/g, '""');
            return needsQuotes ? `"${escaped}"` : escaped;
        };

        const csvLines: string[] = [];
        csvLines.push([
            "Supplier",
            "Trained",
            "Paused",
            "Skill Level",
        ].map(csvEscape).join(","));

        for (const row of rows) {
            csvLines.push(
                [
                    row.name,
                    row.draftTrained ? "Yes" : "No",
                    row.draftPaused ? "Yes" : "No",
                    String(row.skill),
                ]
                    .map(csvEscape)
                    .join(","),
            );
        }

        const csv = csvLines.join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().slice(0, 10);
        link.download = `bpc-supplier-skills-${bpcId ?? "me"}-${date}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => {
            try {
                URL.revokeObjectURL(url);
            } catch {
                // ignore
            }
        }, 30_000);
    }, [bpcId, rows]);

    const persistMutation = useMutation({
        mutationFn: (payload: {
            skills: { supplier_id: number; skill: number; trained: boolean; paused: boolean }[];
        }) => upsertBpcSupplierSkills(payload, bpcId),
        onSuccess: async (res) => {
            toast.success(res.message ?? "Supplier skills updated");
            await refetch();
        },
        onError: (err: unknown) => {
            console.error("SupplierSkills save error:", err);
            toast.error("Failed to update supplier skills");
        },
    });

    const buildPayloadRows = useCallback(
        (supplierIds?: number[]) => {
            const sourceRows = (data || []).filter((row) =>
                supplierIds ? supplierIds.includes(row.id) : true,
            );

            return sourceRows
                .map((row) => {
                    const current = draft[row.id] ?? defaultDraftRow(row);
                    const skill = current.trained
                        ? clampSkill(Number(current.skill === "" ? 0 : current.skill))
                        : 0;
                    const next = {
                        supplier_id: row.id,
                        skill,
                        trained: current.trained,
                        paused: current.trained ? current.paused : false,
                    };
                    const original = originalRowMap[row.id] ?? defaultDraftRow(row);

                    const changed =
                        next.skill !== clampSkill(row.skill ?? 0) ||
                        next.trained !== original.trained ||
                        (next.trained ? next.paused : false) !== original.paused;

                    return changed ? next : null;
                })
                .filter((row): row is NonNullable<typeof row> => row !== null);
        },
        [data, draft, originalRowMap],
    );

    const columns: ColumnDef<TSupplierSkillRow>[] = useMemo(
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
                    const value = row.original.draftSkill;
                    const trained = row.original.draftTrained;

                    return (
                        <div className="max-w-[180px]">
                            <Input
                                type="text"
                                value={value}
                                onChange={(e) =>
                                    handleDraftChange(supplierId, e.target.value)
                                }
                                onBlur={() => handleDraftBlur(supplierId)}
                                disabled={!trained}
                                className={!trained ? "bg-gray-100 text-gray-400" : ""}
                            />
                        </div>
                    );
                },
            },
            {
                id: "trained",
                header: "Trained",
                enableSorting: false,
                cell: ({ row }) => {
                    const supplierId = row.original.id;
                    const trained = row.original.draftTrained;

                    return (
                        <div className="flex justify-center">
                            <Button
                                size="xs"
                                variant={trained ? "success" : "danger"}
                                onClick={() => {
                                    updateDraftRow(supplierId, (current) => ({
                                        ...current,
                                        trained: !current.trained,
                                        paused: current.trained ? false : current.paused,
                                        skill: current.trained ? "0" : current.skill || "0",
                                    }));
                                }}
                            >
                                {trained ? "Yes" : "No"}
                            </Button>
                        </div>
                    );
                },
            },
            {
                id: "paused",
                header: "Paused",
                enableSorting: false,
                cell: ({ row }) => {
                    const supplierId = row.original.id;
                    const trained = row.original.draftTrained;
                    const paused = row.original.draftPaused;

                    if (!trained) {
                        return <div className="h-8" />;
                    }

                    return (
                        <div className="flex justify-center">
                            <Button
                                size="xs"
                                variant={paused ? "warning" : "info"}
                                onClick={() => {
                                    updateDraftRow(supplierId, (current) => ({
                                        ...current,
                                        paused: !current.paused,
                                    }));
                                }}
                            >
                                {paused ? "Unpause" : "Pause"}
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [handleDraftBlur, handleDraftChange, updateDraftRow],
    );

    const onSave = () => {
        const changed = buildPayloadRows();

        if (changed.length === 0) {
            toast.message("No changes to save");
            return;
        }

        const payload = { skills: changed };

        toast.promise(persistMutation.mutateAsync(payload), {
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
                            <Button
                                variant="warning"
                                onClick={() => {
                                    const nextPaused = !allPaused;
                                    setDraft((prev) => {
                                        const next = { ...prev };
                                        for (const row of rows) {
                                            next[row.id] = {
                                                ...(next[row.id] ?? defaultDraftRow(row)),
                                                paused: nextPaused,
                                            };
                                        }
                                        return next;
                                    });
                                }}
                                size="sm"
                                disabled={rows.length === 0}
                            >
                                {allPaused ? "Unpause All" : "Pause All"}
                            </Button>
                            <Button variant="outline" onClick={() => refetch()} size="sm">
                                Refresh
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[800px] xl:min-w-full px-2">
                            <DataTable
                                columns={columns}
                                data={rows}
                                onExportCsv={exportCsv}
                                exportCsvDisabled={rows.length === 0}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={() => {
                                if (!data) return;
                                const next: Record<number, DraftRow> = {};
                                for (const row of data) {
                                    next[row.id] = defaultDraftRow(row);
                                }
                                setDraft(next);
                            }}
                            disabled={persistMutation.isPending}
                        >
                            Reset
                        </Button>
                        <Button onClick={onSave} disabled={persistMutation.isPending}>
                            {persistMutation.isPending ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </div>
            )}
        </ComponentCard>
    );
}
