import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import Select from "@/components/form/Select";
import { Modal } from "@/components/ui/modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Label from "@/components/form/Label";
import {
    fetchOverviewQueueList,
} from "@/database/overview_api";
import {
    abortBordereau,
    deleteBordereau,
    exportBordereauActivities,
    processBordereauBatchNow,
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

export default function OverviewIndex() {
    const queryClient = useQueryClient();
    const {
        departmentId,
        departmentIdNumber,
        departmentOptions,
        setDepartmentId,
    } = useOverviewDepartmentFilter();

    const DEFAULT_PER_PAGE = 100;
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

    const processNowMutation = useMutation({
        mutationFn: async (bordereauId: number) => {
            await processBordereauBatchNow({ bordereau_id: bordereauId });
        },
        onSuccess: () => {
            toast.success("Bordereau batch queued to process now");
            void queryClient.invalidateQueries({ queryKey: ["overview", "queue-list"] });
            void queryClient.refetchQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to process bordereau batch now";
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
            const fallbackMessage = "Failed to delete bordereau";
            const message =
                error instanceof Error
                    ? error.message
                    : typeof error === "object" && error !== null && "message" in error
                        ? String(
                            (error as { message?: unknown }).message ?? fallbackMessage,
                        )
                        : fallbackMessage;
            toast.error(message);
        },
    });

    const normalizedQueuedRows: OverviewQueuedRow[] = useMemo(() => {
        const processingIds = new Set([6, 7, 15, 16, 17, 18]);
        const queuedIds = new Set([1, 3]);

        return (queueListData?.rows ?? []).map((row) => {
            const statusId = Number(row.bordereau_status_id);

            if (!Number.isFinite(statusId)) {
                return row as OverviewQueuedRow;
            }

            let statusLabel = row.bordereau_status;

            if (processingIds.has(statusId)) {
                statusLabel = "Processing";
            } else if (queuedIds.has(statusId)) {
                statusLabel = "Queued";
            } else if (row.is_completed) {
                // Only show "Completed" when backend marks it completed
                statusLabel = "Completed";
            }

            return {
                ...row,
                bordereau_status: statusLabel,
                // IMPORTANT: do not override row.is_completed; backend owns this
            } as OverviewQueuedRow;
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
                onProcessNow: (bordereauId: number) =>
                    processNowMutation.mutate(bordereauId),
                processNowPendingBordereauId: processNowMutation.isPending
                    ? (processNowMutation.variables ?? null)
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
        [
            processNextMutation,
            processNowMutation,
            pauseMutation,
            exportMutation,
            abortMutation,
            deleteMutation,
        ],
    );

    return (
        <>
            <PageBreadcrumb pageTitle="Bordereau Detail" />

            <div className="col-span-12">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            List of Bordereau
                        </h3>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:min-w-[560px]">
                        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-white/5">
                            <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Department
                            </Label>
                            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                                Limit the queue to one department, or leave it on all departments.
                            </p>
                            <Select
                                value={departmentId}
                                onChange={setDepartmentId}
                                options={departmentOptions}
                                placeholder="All departments"
                            />
                        </div>

                        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-white/5">
                            <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Include Completed?
                            </Label>
                            <p className="mb-3 text-xs text-gray-500 dark:text-gray-400">
                                Show completed bordereau rows in the table when needed.
                            </p>
                            <RadioGroup
                                value={includeCompleted ? "yes" : "no"}
                                onValueChange={(v) =>
                                    setIncludeCompleted(String(v) === "yes")
                                }
                            >
                                <div className="flex flex-wrap items-center gap-4">
                                    <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                        <RadioGroupItem value="yes" id="include-completed-yes" />
                                        <Label htmlFor="include-completed-yes" className="mb-0">
                                            Yes
                                        </Label>
                                    </div>
                                    <div className="flex items-center space-x-2 rounded-md border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-900">
                                        <RadioGroupItem value="no" id="include-completed-no" />
                                        <Label htmlFor="include-completed-no" className="mb-0">
                                            No
                                        </Label>
                                    </div>
                                </div>
                            </RadioGroup>
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

