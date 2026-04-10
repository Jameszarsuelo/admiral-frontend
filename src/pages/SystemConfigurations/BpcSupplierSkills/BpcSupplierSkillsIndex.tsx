import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FilterFieldCard from "@/components/common/FilterFieldCard";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";

import { fetchBpcById, fetchBpcOptions } from "@/database/bpc_api";
import { fetchBpcSupplierSkills } from "@/database/bpc_supplier_skills_api";
import { fetchContactById } from "@/database/contact_api";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useOverviewDepartmentFilter } from "@/pages/Overview/useOverviewDepartmentFilter";
import type { IBPCForm } from "@/types/BPCSchema";

type BpcOption = { value: number; label: string };

type BpcDetailsForExport = IBPCForm & {
    bpc_line_manager?: number | null;
    bpc_department_name?: string;
    contact?: {
        firstname?: string | null;
        lastname?: string | null;
    };
};

type SupplierSkillExportRow = {
    id: number;
    name: string;
    skill: number;
    trained?: boolean;
    paused?: boolean;
};

function csvEscape(value: unknown): string {
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
}

function formatFullName(first?: string | null, last?: string | null): string {
    return [first, last].filter((part) => Boolean(part && part.trim())).join(" ");
}

export default function BpcSupplierSkillsIndex() {
    const navigate = useNavigate();
    const [isExporting, setIsExporting] = useState(false);
    const {
        departmentId,
        departmentIdNumber,
        departmentOptions,
        setDepartmentId,
    } = useOverviewDepartmentFilter();

    const columns = useMemo<ColumnDef<{ value: number; label: string }>[]>(
        () => [
            {
                accessorKey: "label",
                header: "BPC",
            },
            {
                id: "actions",
                header: "Actions",
                enableSorting: false,
                cell: ({ row }) => (
                    <div className="flex justify-end">
                        <Button
                            size="sm"
                            onClick={() => navigate(`view/${row.original.value}`)}
                        >
                            View
                        </Button>
                    </div>
                ),
            },
        ],
        [navigate],
    );

    const {
        data: bpcs,
        isLoading,
        isError,
        error,
        refetch,
    } = useQuery<BpcOption[]>({
        queryKey: ["bpc-options", departmentIdNumber ?? "all"],
        queryFn: () => fetchBpcOptions(departmentIdNumber),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    const filteredBpcs = useMemo(() => bpcs || [], [bpcs]);

    const exportCsv = useCallback(async () => {
        if (filteredBpcs.length === 0 || isExporting) {
            return;
        }

        setIsExporting(true);

        try {
            const contactNameCache = new Map<number, string>();

            const bpcSnapshots = await Promise.all(
                filteredBpcs.map(async (bpc) => {
                    const [details, skills] = await Promise.all([
                        fetchBpcById(String(bpc.value)) as Promise<BpcDetailsForExport>,
                        fetchBpcSupplierSkills(bpc.value) as Promise<SupplierSkillExportRow[]>,
                    ]);

                    const lineManagerId = details.bpc_line_manager ?? null;
                    let lineManagerName = "";

                    if (lineManagerId) {
                        const cached = contactNameCache.get(lineManagerId);
                        if (cached !== undefined) {
                            lineManagerName = cached;
                        } else {
                            const contact = await fetchContactById(String(lineManagerId));
                            lineManagerName = formatFullName(
                                contact.firstname,
                                contact.lastname,
                            );
                            contactNameCache.set(lineManagerId, lineManagerName);
                        }
                    }

                    return {
                        bpc,
                        details,
                        skills,
                        lineManagerName,
                    };
                }),
            );

            const supplierColumns = bpcSnapshots[0]?.skills ?? [];

            const csvLines: string[] = [];
            const headers: string[] = ["BPC Agent", "Line Manager", "Department"];

            for (const supplier of supplierColumns) {
                const supplierLabel = supplier.name?.trim() || `Supplier ${supplier.id}`;
                headers.push(`Trained ${supplierLabel}`);
                headers.push(`Paused ${supplierLabel}`);
                headers.push(`Skill ${supplierLabel}`);
            }

            csvLines.push(headers.map(csvEscape).join(","));

            for (const snapshot of bpcSnapshots) {
                const skillMap = new Map(
                    snapshot.skills.map((skill) => [skill.id, skill]),
                );

                const row: string[] = [
                    formatFullName(
                        snapshot.details.contact?.firstname,
                        snapshot.details.contact?.lastname,
                    ) || snapshot.bpc.label,
                    snapshot.lineManagerName,
                    snapshot.details.bpc_department_name ?? "",
                ];

                for (const supplier of supplierColumns) {
                    const skill = skillMap.get(supplier.id);
                    const trained = skill?.trained ?? true;
                    const paused = skill?.paused ?? true;

                    row.push(trained ? "Yes" : "No");
                    row.push(trained ? (paused ? "Paused" : "Unpaused") : "N/A");
                    row.push(trained ? String(skill?.skill ?? 0) : "0");
                }

                csvLines.push(row.map(csvEscape).join(","));
            }

            const csv = `\uFEFF${csvLines.join("\n")}`;
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const date = new Date().toISOString().slice(0, 10);
            link.download = `bpc-supplier-skills-matrix-${date}.csv`;
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
        } catch (error) {
            console.error("BPC supplier skills export error:", error);
            toast.error("Failed to export BPC supplier skills");
        } finally {
            setIsExporting(false);
        }
    }, [filteredBpcs, isExporting]);

    return (
        <>
            <PageBreadcrumb pageTitle="BPC Supplier Skills" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-5 mb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            BPC Supplier Skills
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            Select a BPC to view/edit Supplier Skills (SBR).
                        </p>
                    </div>
                </div>

                <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:max-w-3xl">
                    <FilterFieldCard
                        label="Department"
                        description="Filter the BPC list by department before choosing a record."
                    >
                        <Select
                            value={departmentId}
                            onChange={setDepartmentId}
                            options={departmentOptions}
                            placeholder="All departments"
                        />
                    </FilterFieldCard>
                </div>

                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                ) : isError ? (
                    <div className="space-y-3">
                        <p className="text-sm text-error-500">
                            Failed to load BPC list.
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
                        <Button size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </div>
                ) : (
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[600px] xl:min-w-full px-2">
                            <DataTable
                                columns={columns}
                                data={filteredBpcs}
                                onExportCsv={exportCsv}
                                exportCsvDisabled={isExporting}
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
