import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import type { PaginationState, Updater } from "@tanstack/react-table";
import { toast } from "sonner";
import { fetchUploadExceptions } from "@/database/upload_exceptions_api";
import { deleteBordereau } from "@/database/bordereau_api";
import { useNavigate } from "react-router-dom";
import {
    getUploadExceptionsColumns,
    type UploadExceptionsRow,
} from "@/data/UploadExceptionsHeaders";

export default function UploadExceptionsIndex() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

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

    const { data } = useQuery({
        queryKey: ["upload-exceptions", pagination.page, pagination.per_page, searchApplied],
        queryFn: () =>
            fetchUploadExceptions({
                page: pagination.page,
                per_page: pagination.per_page,
                search: searchApplied,
            }),
        refetchOnWindowFocus: false,
        staleTime: 0,
    });

    const rows: UploadExceptionsRow[] = useMemo(
        () => (data?.rows ?? []) as UploadExceptionsRow[],
        [data?.rows],
    );

    const pageCount = (() => {
        const total = Number(data?.total ?? 0);
        const perPage = Number(data?.per_page ?? pagination.per_page);
        if (!Number.isFinite(total) || total <= 0) return 0;
        if (!Number.isFinite(perPage) || perPage <= 0) return 0;
        return Math.ceil(total / perPage);
    })();

    const [removeTarget, setRemoveTarget] = useState<UploadExceptionsRow | null>(
        null,
    );
    const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);

    const removeMutation = useMutation({
        mutationFn: async (vars: { bordereauId: number }) => {
            return await deleteBordereau(vars.bordereauId);
        },
        onSuccess: () => {
            toast.success("Bordereau removed");
            setIsRemoveModalOpen(false);
            setRemoveTarget(null);
            void queryClient.invalidateQueries({ queryKey: ["upload-exceptions"] });
            void queryClient.refetchQueries({ queryKey: ["upload-exceptions"] });
        },
        onError: (error) => {
            const message =
                typeof error === "string"
                    ? error
                    : (error as any)?.message
                        ? String((error as any).message)
                        : "Failed to remove bordereau";
            toast.error(message);
        },
    });

    const columns = useMemo(
        () =>
            getUploadExceptionsColumns({
                onEditCorrect: (row) => {
                    navigate(`/upload-exceptions/batch/${row.upload_batch_number}`);
                },
                onRequestRemove: (row) => {
                    setRemoveTarget(row);
                    setIsRemoveModalOpen(true);
                },
                removePendingBordereauId: removeMutation.isPending
                    ? (removeMutation.variables?.bordereauId ?? null)
                    : null,
            }),
        [
            navigate,
            removeMutation.isPending,
            removeMutation.variables?.bordereauId,
        ],
    );

    return (
        <>
            <PageBreadcrumb pageTitle="Upload Exceptions" />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            List of Bordereau with Import Errors
                        </h3>
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

            <Modal
                isOpen={isRemoveModalOpen}
                onClose={() => {
                    if (removeMutation.isPending) return;
                    setIsRemoveModalOpen(false);
                    setRemoveTarget(null);
                }}
                className="w-lg m-4"
            >
                <div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
                    <div className="px-2 pr-14">
                        <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
                            Remove Confirmation
                        </h4>
                        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
                            Are you sure to remove this Bordereau? This will
                            permanently delete the bordereau and all line items.
                        </p>
                        <Button
                            size="sm"
                            variant="danger"
                            disabled={!removeTarget || removeMutation.isPending}
                            onClick={() => {
                                if (!removeTarget) return;
                                removeMutation.mutate({
                                    bordereauId: removeTarget.bordereau_id,
                                });
                            }}
                        >
                            {removeMutation.isPending
                                ? "Removing..."
                                : "Confirm Remove"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
