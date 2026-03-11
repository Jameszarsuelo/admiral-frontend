import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
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
import {
    abortBordereau,
    deleteBordereau,
    exportBordereauActivities,
    pauseBordereau,
    queueBordereauForBpc,
    unpauseBordereau,
} from "@/database/bordereau_api";
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

    const pauseMutation = useMutation({
        mutationFn: async (vars: { bordereauId: number; nextPaused: boolean }) => {
            if (vars.nextPaused) {
                await pauseBordereau({ bordereau_id: vars.bordereauId });
                return;
            }
            await unpauseBordereau({ bordereau_id: vars.bordereauId });
        },
        onSuccess: (_data, vars) => {
            toast.success(vars.nextPaused ? "Bordereau paused" : "Bordereau unpaused");
            void queryClient.invalidateQueries({ queryKey: ["overview", "queue-list"] });
            void queryClient.refetchQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to update bordereau pause state";
            toast.error(message);
        },
    });

    const abortMutation = useMutation({
        mutationFn: async (vars: { bordereauId: number }) => {
            await abortBordereau({ bordereau_id: vars.bordereauId });
        },
        onSuccess: () => {
            toast.success("Bordereau aborted");
            void queryClient.invalidateQueries({ queryKey: ["overview", "queue-list"] });
            void queryClient.refetchQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to abort bordereau";
            toast.error(message);
        },
    });

    const exportMutation = useMutation({
        mutationFn: async (vars: { bordereauId: number }) => {
            return await exportBordereauActivities(vars.bordereauId);
        },
        onSuccess: (blob, vars) => {
            const date = new Date().toISOString().slice(0, 10);
            const filename = `bordereau-activities-${vars.bordereauId}-${date}.csv`;

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = filename;
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
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to export bordereau activities";
            toast.error(message);
        },
    });

    const [deleteTarget, setDeleteTarget] = useState<OverviewQueuedRow | null>(
        null,
    );
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);

    const deleteMutation = useMutation({
        mutationFn: async (vars: { bordereauId: number }) => {
            return await deleteBordereau(vars.bordereauId);
        },
        onSuccess: () => {
            toast.success("Bordereau deleted");
            setIsDeleteModalOpen(false);
            setDeleteTarget(null);
            void queryClient.invalidateQueries({
                queryKey: ["overview", "queue-list"],
            });
            void queryClient.refetchQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                typeof error === "string"
                    ? error
                    : (error as any)?.message
                        ? String((error as any).message)
                        : "Failed to delete bordereau";
            toast.error(message);
        },
    });

    const normalizedQueuedRows: OverviewQueuedRow[] = useMemo(() => {
        const processingIds = new Set([6, 7, 15, 16, 17, 18]);
        const queuedIds = new Set([1, 3]);

        return (queueListData?.rows ?? []).map((row) => {
            const statusIdFromField = row.bordereau_status_id;
            const statusIdFromLabel = Number(row.bordereau_status);
            const statusId = Number.isFinite(Number(statusIdFromField))
                ? Number(statusIdFromField)
                : Number.isFinite(statusIdFromLabel)
                    ? statusIdFromLabel
                    : NaN;

            if (Number.isFinite(statusId)) {
                const statusLabel = processingIds.has(statusId)
                    ? "Processing"
                    : queuedIds.has(statusId)
                        ? "Queued"
                        : "Completed";

                return {
                    ...row,
                    bordereau_status: statusLabel,
                    is_completed: statusLabel === "Completed",
                } as OverviewQueuedRow;
            }

            // Fallback: keep backend-provided label and completion flag.
            return row as OverviewQueuedRow;
        });
    }, [queueListData?.rows]);

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
                processNextPendingBordereauId: processNextMutation.isPending
                    ? (processNextMutation.variables ?? null)
                    : null,
                onTogglePause: (bordereauId: number, nextPaused: boolean) =>
                    pauseMutation.mutate({ bordereauId, nextPaused }),
                pausePendingBordereauId: pauseMutation.isPending
                    ? (pauseMutation.variables?.bordereauId ?? null)
                    : null,
                onExport: (bordereauId: number) =>
                    exportMutation.mutate({ bordereauId }),
                exportPendingBordereauId: exportMutation.isPending
                    ? (exportMutation.variables?.bordereauId ?? null)
                    : null,
                onAbort: (bordereauId: number) =>
                    abortMutation.mutate({ bordereauId }),
                abortPendingBordereauId: abortMutation.isPending
                    ? (abortMutation.variables?.bordereauId ?? null)
                    : null,
                onRequestDelete: (row) => {
                    setDeleteTarget(row);
                    setIsDeleteModalOpen(true);
                },
                deletePendingBordereauId: deleteMutation.isPending
                    ? (deleteMutation.variables?.bordereauId ?? null)
                    : null,
            }),
        [processNextMutation, pauseMutation, exportMutation, abortMutation, deleteMutation],
    );

    return (
        <>
            <PageBreadcrumb pageTitle="Overview" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
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
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
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
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
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
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
                        onClick={() => navigate(withDepartmentQuery("/overview/tim-today"))}
                    >
                        <EcommerceMetrics label="TIM (Today)" value={timTodayValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
                        onClick={() => navigate(withDepartmentQuery("/overview/tim-bot"))}
                    >
                        <EcommerceMetrics label="TIM (BoT)" value={timBotValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02] focus-visible:outline-hidden focus-visible:ring-3 focus-visible:ring-brand-500/10"
                        onClick={() => navigate(withDepartmentQuery("/overview/forecast"))}
                    >
                        <EcommerceMetrics label="Forecast" value={forecastValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div className="w-full [&>div]:transition-all [&>div]:duration-200 [&>div]:ease-out [&>div]:transform-gpu hover:[&>div]:shadow-theme-md hover:[&>div]:-translate-y-0.5 hover:[&>div]:scale-[1.02]">
                        <EcommerceMetrics label="Outstanding Referrals" value="0" />
                    </div>
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
                                    data={normalizedQueuedRows}
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

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    if (deleteMutation.isPending) return;
                    setIsDeleteModalOpen(false);
                    setDeleteTarget(null);
                }}
                className="w-lg m-4"
            >
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Delete Confirmation
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Are you sure to delete this Bordereau? This will delete
                            the Bordereau and all line items.
                        </p>
                        <Button
                            size="sm"
                            variant="danger"
                            disabled={!deleteTarget || deleteMutation.isPending}
                            onClick={() => {
                                if (!deleteTarget) return;
                                deleteMutation.mutate({
                                    bordereauId: deleteTarget.bordereau_id,
                                });
                            }}
                        >
                            {deleteMutation.isPending
                                ? "Deleting..."
                                : "Confirm Delete"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}

