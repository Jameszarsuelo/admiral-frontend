import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { useParams } from "react-router-dom";
import { fetchUploadExceptionActivities } from "@/database/upload_exceptions_api";
import {
    getOverviewBatchActivitiesColumns,
    type OverviewBatchActivityRow,
} from "@/data/OverviewBatchActivitiesHeaders";

export default function OverviewBatchActivitiesIndex() {
    const params = useParams();
    const uploadBatchNumber = Number(params.uploadBatchNumber);

    const DEFAULT_PER_PAGE = 100;
    const [pagination, setPagination] = useState<{ page: number; per_page: number }>(
        {
            page: 1,
            per_page: DEFAULT_PER_PAGE,
        },
    );

    const [search, setSearch] = useState<string>("");
    const [searchApplied, setSearchApplied] = useState<string>("");

    useEffect(() => {
        const handle = window.setTimeout(() => {
            setSearchApplied(search.trim());
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 300);

        return () => window.clearTimeout(handle);
    }, [search]);

    const enabled = Number.isFinite(uploadBatchNumber) && uploadBatchNumber > 0;

    const { data } = useQuery({
        queryKey: [
            "overview",
            "queue-batch",
            uploadBatchNumber,
            pagination.page,
            pagination.per_page,
            searchApplied,
        ],
        enabled,
        queryFn: () =>
            fetchUploadExceptionActivities(uploadBatchNumber, {
                page: pagination.page,
                per_page: pagination.per_page,
                search: searchApplied,
                only_errors: false,
            }),
        refetchOnWindowFocus: false,
        staleTime: 0,
    });

    const rows: OverviewBatchActivityRow[] = useMemo(
        () => (data?.rows ?? []) as OverviewBatchActivityRow[],
        [data?.rows],
    );

    const pageCount = (() => {
        const total = Number(data?.total ?? 0);
        const perPage = Number(data?.per_page ?? pagination.per_page);
        if (!Number.isFinite(total) || total <= 0) return 0;
        if (!Number.isFinite(perPage) || perPage <= 0) return 0;
        return Math.ceil(total / perPage);
    })();

    const columns = useMemo(() => getOverviewBatchActivitiesColumns(), []);

    return (
        <>
            <PageBreadcrumb pageTitle="Overview" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-2 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Bordereau Batch Activities
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Upload Batch: {enabled ? uploadBatchNumber : "-"}
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full px-2">
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
                                        Number(next.pageSize) !==
                                        Number(current.pageSize);

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
