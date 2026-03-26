import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FilterFieldCard from "@/components/common/FilterFieldCard";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";

import { fetchBpcOptions } from "@/database/bpc_api";
import { DataTable } from "@/components/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useOverviewDepartmentFilter } from "@/pages/Overview/useOverviewDepartmentFilter";

export default function BpcSupplierSkillsIndex() {
    const navigate = useNavigate();
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
    } = useQuery<{ value: number; label: string }[]>({
        queryKey: ["bpc-options", departmentIdNumber ?? "all"],
        queryFn: () => fetchBpcOptions(departmentIdNumber),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });

    const filteredBpcs = useMemo(() => bpcs || [], [bpcs]);

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
                            <DataTable columns={columns} data={filteredBpcs} />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
