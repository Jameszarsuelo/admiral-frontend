import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Label from "@/components/form/Label";
import {
    fetchForecastSnapshot,
    fetchHeadcountToday,
    fetchOutstandingQueries,
    fetchOverviewQueueList,
    fetchProductionLineToday,
    fetchTimBotSnapshot,
    fetchTimTodaySnapshot,
} from "@/database/overview_api";
import { queueBordereauForBpc } from "@/database/bordereau_api";
import {
    getOverviewQueuedColumns,
    type OverviewQueuedRow,
} from "@/data/OverviewQueuedHeaders.tsx";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { useOverviewDepartmentFilter } from "./useOverviewDepartmentFilter";
import OverviewDepartmentFilterCard from "./OverviewDepartmentFilterCard";

export default function OverviewIndex() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        departmentId,
        departmentIdNumber,
        departmentOptions,
        setDepartmentId,
        withDepartmentQuery,
    } = useOverviewDepartmentFilter();

    const { data: headcountToday } = useQuery({
        queryKey: ["overview", "headcount", "today", "headline", departmentIdNumber],
        queryFn: () => fetchHeadcountToday(departmentIdNumber, false),
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: productionLineToday } = useQuery({
        queryKey: ["overview", "production-line", "headline", departmentIdNumber],
        queryFn: () => fetchProductionLineToday(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const { data: outstandingQueries } = useQuery({
        queryKey: ["overview", "outstanding-queries", "headline", departmentIdNumber],
        queryFn: () => fetchOutstandingQueries(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const { data: forecastSnapshot } = useQuery({
        queryKey: ["overview", "forecast", "headline", departmentIdNumber],
        queryFn: () => fetchForecastSnapshot(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const headcountValue = new Intl.NumberFormat().format(
        headcountToday?.online_count ?? 0,
    );
    const productionLineValue = `${productionLineToday?.oldest_queued_days ?? 0} day(s)`;
    const outstandingQueriesValue = new Intl.NumberFormat().format(
        outstandingQueries?.query_activities_count ?? 0,
    );
    const forecastValue = `${Number(forecastSnapshot?.projected_days ?? 0).toFixed(2)} day(s)`;

    const { data: timTodaySnapshot } = useQuery({
        queryKey: ["overview", "tim-today", "headline", departmentIdNumber],
        queryFn: () => fetchTimTodaySnapshot(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const timTodayValue = timTodaySnapshot?.headline_aht ?? "00:00:00";

    const { data: timBotSnapshot } = useQuery({
        queryKey: ["overview", "tim-bot", "headline", departmentIdNumber],
        queryFn: () => fetchTimBotSnapshot(departmentIdNumber),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const timBotValue = timBotSnapshot?.headline_aht ?? "00:00:00";

    const DEFAULT_PER_PAGE = 10;
    const [queuePagination, setQueuePagination] = useState<{
        page: number;
        per_page: number;
    }>({
        page: 1,
        per_page: DEFAULT_PER_PAGE,
    });

    const [queueSearch, setQueueSearch] = useState<string>("");
    const [queueSearchApplied, setQueueSearchApplied] = useState<string>("");

    const [includeCompleted, setIncludeCompleted] = useState<boolean>(false);

    useEffect(() => {
        const handle = window.setTimeout(() => {
            setQueueSearchApplied(queueSearch.trim());
            setQueuePagination((prev) => ({
                ...prev,
                page: 1,
            }));
        }, 300);

        return () => window.clearTimeout(handle);
    }, [queueSearch]);

    useEffect(() => {
        setQueuePagination((prev) => ({
            ...prev,
            page: 1,
        }));
    }, [departmentIdNumber]);

    useEffect(() => {
        setQueuePagination((prev) => ({
            ...prev,
            page: 1,
        }));
    }, [includeCompleted]);

    const { data: queueListData } = useQuery({
        queryKey: [
            "overview",
            "queue-list",
            departmentIdNumber,
            includeCompleted,
            queuePagination.page,
            queuePagination.per_page,
            queueSearchApplied,
        ],
        queryFn: () =>
            fetchOverviewQueueList({
                department_id: departmentIdNumber,
                include_completed: includeCompleted,
                page: queuePagination.page,
                per_page: queuePagination.per_page,
                search: queueSearchApplied,
            }),
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const processNextMutation = useMutation({
        mutationFn: async (bordereauId: number) => {
            await queueBordereauForBpc({ bordereau_id: bordereauId });
        },
        onSuccess: () => {
            toast.success("Bordereau queued to process next");
            void queryClient.invalidateQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to queue bordereau for processing";
            toast.error(message);
        },
    });

    const queuedRows: OverviewQueuedRow[] = queueListData?.rows ?? [];

    const queuePageCount = (() => {
        const total = Number(queueListData?.total ?? 0);
        const perPage = Number(queueListData?.per_page ?? queuePagination.per_page);
        if (!Number.isFinite(total) || total <= 0) return 0;
        if (!Number.isFinite(perPage) || perPage <= 0) return 0;
        return Math.ceil(total / perPage);
    })();

    const overviewQueuedColumns = useMemo(
        () =>
            getOverviewQueuedColumns({
                onProcessNext: (bordereauId: number) =>
                    processNextMutation.mutate(bordereauId),
                processNextPending: processNextMutation.isPending,
            }),
        [processNextMutation],
    );

    return (
        <>
            <PageBreadcrumb pageTitle="Overview" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/headcount"))}
                    >
                        <EcommerceMetrics
                            label="Headcount"
                            value={headcountValue}
                        />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/production-line"))}
                    >
                        <EcommerceMetrics
                            label="Production Line"
                            value={productionLineValue}
                        />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/outstanding-queries"))}
                    >
                        <EcommerceMetrics
                            label="Outstanding Queries"
                            value={outstandingQueriesValue}
                        />
                    </button>
                </div>

                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <OverviewDepartmentFilterCard
                        value={departmentId}
                        onChange={setDepartmentId}
                        options={departmentOptions}
                    />
                </div>

                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/tim-today"))}
                    >
                        <EcommerceMetrics label="TIM (Today)" value={timTodayValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/tim-bot"))}
                    >
                        <EcommerceMetrics label="TIM (BoT)" value={timBotValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate(withDepartmentQuery("/overview/forecast"))}
                    >
                        <EcommerceMetrics label="Forecast" value={forecastValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics label="Outstanding Referrals" value="0" />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    List of Bordereau
                                </h3>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <Label className="mb-0">Include Completed?</Label>
                                    <RadioGroup
                                        value={includeCompleted ? "yes" : "no"}
                                        onValueChange={(v) =>
                                            setIncludeCompleted(String(v) === "yes")
                                        }
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="yes" id="include-completed-yes" />
                                                <Label htmlFor="include-completed-yes" className="mb-0">
                                                    Yes
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="include-completed-no" />
                                                <Label htmlFor="include-completed-no" className="mb-0">
                                                    No
                                                </Label>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto custom-scrollbar">
                            <div className="min-w-[1000px] xl:min-w-full px-2">
                                <DataTable
                                    columns={overviewQueuedColumns}
                                    data={queuedRows}
                                    manualPagination
                                    manualFiltering
                                    globalFilter={queueSearch}
                                    onGlobalFilterChange={(value) => {
                                        setQueueSearch(value);
                                    }}
                                    pageCount={queuePageCount}
                                    pagination={{
                                        pageIndex: Math.max(0, queuePagination.page - 1),
                                        pageSize: queuePagination.per_page,
                                    }}
                                    onPaginationChange={(
                                        updater: Updater<PaginationState>,
                                    ) => {
                                        setQueuePagination((prev) => {
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
                </div>
            </div>
        </>
    );
}
