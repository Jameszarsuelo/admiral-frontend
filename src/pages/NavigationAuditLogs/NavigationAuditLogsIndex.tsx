import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FilterFieldCard from "@/components/common/FilterFieldCard";
import Select from "@/components/form/Select";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { PaginationState, Updater } from "@tanstack/react-table";
import {
    fetchNavigationAuditLogs,
} from "@/database/navigation_audit_logs_api";
import {
    getNavigationAuditLogsColumns,
    type NavigationAuditLogsRow,
} from "@/data/NavigationAuditLogsHeaders";

export default function NavigationAuditLogsIndex() {
    const DEFAULT_PER_PAGE = 10;
    const [pagination, setPagination] = useState<{ page: number; per_page: number }>(
        {
            page: 1,
            per_page: DEFAULT_PER_PAGE,
        },
    );

    const [search, setSearch] = useState<string>("");
    const [searchApplied, setSearchApplied] = useState<string>("");
    const [allowedFilter, setAllowedFilter] = useState<string>("all");
    const [roleFilter, setRoleFilter] = useState<string>("all");

    useEffect(() => {
        const handle = window.setTimeout(() => {
            setSearchApplied(search.trim());
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 300);

        return () => window.clearTimeout(handle);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [allowedFilter, roleFilter]);

    const { data } = useQuery({
        queryKey: [
            "navigation-audit-logs",
            pagination.page,
            pagination.per_page,
            searchApplied,
            allowedFilter,
            roleFilter,
        ],
        queryFn: () =>
            fetchNavigationAuditLogs({
                page: pagination.page,
                per_page: pagination.per_page,
                search: searchApplied,
                allowed: allowedFilter,
                role: roleFilter,
            }),
        refetchInterval: 10_000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: false,
        staleTime: 10_000,
    });

    const rows: NavigationAuditLogsRow[] = useMemo(
        () => (data?.rows ?? []) as NavigationAuditLogsRow[],
        [data?.rows],
    );

    const roleOptions = useMemo(
        () => [
            { value: "all", label: "All roles" },
            ...(data?.role_options ?? []).map((value) => ({
                value,
                label: value,
            })),
        ],
        [data?.role_options],
    );

    const pageCount = (() => {
        const total = Number(data?.total ?? 0);
        const perPage = Number(data?.per_page ?? pagination.per_page);
        if (!Number.isFinite(total) || total <= 0) return 0;
        if (!Number.isFinite(perPage) || perPage <= 0) return 0;
        return Math.ceil(total / perPage);
    })();

    const columns = useMemo(() => getNavigationAuditLogsColumns(), []);

    return (
        <>
            <PageBreadcrumb pageTitle="Navigation Audit Logs" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Navigation Audit Logs
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Real-time history of authenticated page access.
                        </p>
                    </div>
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
                    <FilterFieldCard
                        label="Allowed"
                        description="Filter by successful or blocked navigation."
                    >
                        <Select
                            value={allowedFilter}
                            onChange={setAllowedFilter}
                            placeholder="Allowed status"
                            options={[
                                { value: "all", label: "All outcomes" },
                                { value: "true", label: "True" },
                                { value: "false", label: "False" },
                            ]}
                        />
                    </FilterFieldCard>
                    <FilterFieldCard
                        label="Role"
                        description="Filter audit entries by role."
                    >
                        <Select
                            value={roleFilter}
                            onChange={setRoleFilter}
                            placeholder="Role"
                            options={roleOptions}
                        />
                    </FilterFieldCard>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1200px] xl:min-w-full px-2">
                        <DataTable
                            columns={columns}
                            data={rows}
                            manualPagination
                            manualFiltering
                            globalFilter={search}
                            onGlobalFilterChange={(value) => {
                                setSearch(value);
                            }}
                            pageCount={pageCount}
                            pagination={{
                                pageIndex: Math.max(0, pagination.page - 1),
                                pageSize: pagination.per_page,
                            }}
                            onPaginationChange={(updater: Updater<PaginationState>) => {
                                setPagination((prev) => {
                                    const current: PaginationState = {
                                        pageIndex: Math.max(0, prev.page - 1),
                                        pageSize: prev.per_page,
                                    };

                                    const next: PaginationState =
                                        typeof updater === "function"
                                            ? updater(current)
                                            : updater;

                                    const pageSizeChanged =
                                        Number(next.pageSize) !== Number(current.pageSize);

                                    return {
                                        page: pageSizeChanged
                                            ? 1
                                            : Math.max(1, next.pageIndex + 1),
                                        per_page: Math.max(1, next.pageSize),
                                    };
                                });
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}