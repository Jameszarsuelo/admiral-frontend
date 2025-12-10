import { fetchBpcStatusList } from "@/database/bpc_status_api";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { User2Icon, FileText } from "lucide-react";
import Select from "@/components/form/Select";
import { useMemo, useState, useEffect, useRef } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import SupplierDocumentsTable from "@/pages/SupplierDirectory/SupplierDocumentTable/SupplierDocumentsTable";
import BordereauSkeleton from "@/components/ui/BordereauSkeleton";
import { addBordereauComment } from "@/database/comment_api";
import { IBPCStatus } from "@/types/BPCStatusSchema";
import { fetchBpcByUserId } from "@/database/bpc_api";
import { IBPCSchema } from "@/types/BPCSchema";
import { IBordereauComment, IBordereauIndex } from "@/types/BordereauSchema";
import { fetchOutcomeList } from "@/database/outcome_api";
import {
    changeBordereauOutcome,
    fetchBpcBordereauByBpcId,
} from "@/database/bordereau_api";
import { changeBpcStatus } from "@/database/bpc_api";
import BordereauDetailsView from "../BordereauDetail/BordereauDetailsView";
import useBpcNotifications from "@/hooks/useBpcNotifications";
import useBpcTimer from "@/hooks/useBpcTimer";
import Button from "@/components/ui/button/Button";

export default function Workplace() {
    const { user, logout } = useAuth();

    const { data: bpcStatusData } = useQuery({
        queryKey: ["bpc-status-list"],
        queryFn: async () => {
            return await fetchBpcStatusList();
        },
    });

    const { data: bpcUser } = useQuery({
        queryKey: ["bpc-data"],
        queryFn: async () => {
            return await fetchBpcByUserId(user!.id);
        },
        enabled: !!user,
    });

    const [selectedStatusId, setSelectedStatusId] = useState<string>("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    const statusOptions = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        const currentId = Number(selectedStatusId);

        // Start with all statuses except 3 and 4 (these should not be selectable).
        let opts: { value: string; label: string; disabled?: boolean }[] = list
            .filter((s) => typeof s.id === "number" && s.id !== 3 && s.id !== 4)
            .map((s) => ({ value: String(s.id), label: s.status }));

        // When current status is 3 or 4, hide status 2 as well.
        if (currentId === 3 || currentId === 4) {
            opts = opts.filter((o) => o.value !== "2");

            // Ensure the current status (3 or 4) is visible so the Select can display it.
            const cur = list.find((s) => s.id === currentId);
            if (cur) {
                // show current status but mark it disabled so user cannot pick it
                opts = [
                    {
                        value: String(cur.id),
                        label: cur.status + " (current)",
                        disabled: true,
                    },
                    ...opts,
                ];
            } else {
                opts = [
                    {
                        value: String(currentId),
                        label: `Status ${currentId} (current)`,
                        disabled: true,
                    },
                    ...opts,
                ];
            }
        }

        return opts;
    }, [bpcStatusData, selectedStatusId]);

    const [newCommentText, setNewCommentText] = useState("");

    const { data: bordereauDetails, isLoading } =
        useQuery<IBordereauIndex | null>({
            queryKey: ["current-bordereau", bpcUser?.id],
            queryFn: async () => {
                return await fetchBpcBordereauByBpcId(bpcUser!.id);
            },
            enabled: !!bpcUser?.id,
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        });

    useEffect(() => {
        if (!bpcUser) return;
        const bpcUserData = bpcUser as IBPCSchema as {
            bpc_status_id?: number;
            status_id?: number;
        };
        const statusId =
            bpcUserData.bpc_status_id ?? bpcUserData.status_id ?? "";
        setSelectedStatusId(String(statusId));
    }, [bpcUser, setSelectedStatusId]);

    const selectedStatus = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        return list.find((s) => String(s.id) === selectedStatusId);
    }, [bpcStatusData, selectedStatusId]);

    // Map specific status IDs to fixed hex colors.
    // If a status id is not listed here (e.g. 1), we fall back to the
    // previous behavior (using `wfm` to pick emerald vs gray).
    const statusColorHex = useMemo(() => {
        const id = Number(selectedStatus?.id ?? selectedStatusId ?? NaN);
        if (Number.isNaN(id)) return undefined;
        switch (id) {
            case 3:
                return "#00B0F0"; // light blue
            case 4:
                return "#002060"; // dark blue
            case 2:
                return "#00B050"; // green
            case 5:
            case 6:
            case 7:
                return "#FF0000"; // red
            default:
                return undefined; // keep current behavior (status 1 etc.)
        }
    }, [selectedStatusId, selectedStatus]);

    // subscribe to notifications and update caches / status
    useBpcNotifications(bpcUser?.id, {
        onStatus: (s) => setSelectedStatusId(String(s.id)),
    });

    const queryClient = useQueryClient();
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
    const [showSupplierModal, setShowSupplierModal] = useState(false);
    const [outcomes, setOutcomes] = useState<
        {
            value: string;
            label: string;
            id: number;
        }[]
    >([]);
    const [outcomeToConfirm, setOutcomeToConfirm] = useState<null | {
        id: number;
        label: string;
    }>(null);
    const [showOutcomeConfirm, setShowOutcomeConfirm] = useState(false);

    // cooldown state
    const [cooldownSeconds, setCooldownSeconds] = useState<number | null>(null);
    const cooldownTotal = 10;
    const cooldownIntervalRef = useRef<number | null>(null);
    const [cooldownLabel, setCooldownLabel] = useState<string | null>(null);
    const outcomeTimeoutRef = useRef<number | null>(null);
    const pollingIntervalRef = useRef<number | null>(null);

    const [showStatusConfirm, setShowStatusConfirm] = useState(false);
    const [pendingStatusId, setPendingStatusId] = useState<number | null>(null);
    const [awaitingRefetch, setAwaitingRefetch] = useState(false);

    const addCommentMutation = useMutation({
        mutationFn: ({
            bordereauId,
            comment,
        }: {
            bordereauId: number;
            comment: string;
        }) => addBordereauComment(bordereauId, comment),
        onMutate: async ({ bordereauId, comment }) => {
            await queryClient.cancelQueries({
                queryKey: ["current-bordereau", bpcUser?.id],
            });
            const previous = queryClient.getQueryData([
                "current-bordereau",
                bpcUser?.id,
            ]) as IBordereauIndex | null;

            // create optimistic comment
            const optimisticComment: IBordereauComment = {
                id: -Date.now(),
                bordereau_id: bordereauId,
                comment,
                created_by: user ? `${user.firstname} ${user.lastname}` : "",
                created_at: new Date().toISOString(),
            };

            if (previous) {
                queryClient.setQueryData(
                    ["current-bordereau", bpcUser?.id],
                    () => ({
                        ...previous,
                        comments: [
                            ...(previous.comments || []),
                            optimisticComment,
                        ],
                    }),
                );
            }

            return { previous };
        },
        onError: (
            _error,
            _variables,
            context?: { previous?: IBordereauIndex | null },
        ) => {
            if (context?.previous) {
                queryClient.setQueryData(
                    ["current-bordereau", bpcUser?.id],
                    context.previous,
                );
            }
            toast.error("Failed to add comment");
        },
        onSuccess: () => {
            toast.success("Comment added");
        },
        onSettled: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["current-bordereau", bpcUser?.id],
            });
        },
    });

    const changeStatusMutation = useMutation({
        mutationFn: ({
            bpcId,
            statusId,
        }: {
            bpcId: number;
            statusId: number;
        }) => changeBpcStatus(bpcId, statusId),
        onMutate: async () => {
            setIsUpdatingStatus(true);
        },
        onError: async (err: { message: string }) => {
            console.error("Failed to change status", err);
            // conflict or other error: refetch to get authoritative state
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["bpc-data"] }),
                queryClient.refetchQueries({
                    queryKey: ["current-bordereau", bpcUser?.id],
                }),
            ]);
            toast.error(
                err?.message || "Failed to change status. Refreshing state.",
            );
        },
        onSuccess: async (data: { bpc: IBPCSchema }) => {
            toast.success("Status updated");
            // If backend returned updated bpc, use it; otherwise refetch
            if (data && data.bpc) {
                queryClient.setQueryData(["bpc-data"], data.bpc);
            }
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["bpc-data"] }),
                queryClient.refetchQueries({
                    queryKey: ["current-bordereau", bpcUser?.id],
                }),
                queryClient.refetchQueries({ queryKey: ["bpc-status-list"] }),
            ]);
        },
        onSettled: () => setIsUpdatingStatus(false),
    });

    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    // timer state moved to hook

    const isRefetchingBordereau =
        useIsFetching({ queryKey: ["current-bordereau", bpcUser?.id] }) > 0;

    const { currentFmt, totalFmt } = useBpcTimer(bpcUser?.id, selectedStatusId);

    // fetch outcomes for dropdown
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const list = await fetchOutcomeList();
                if (!mounted) return;
                const opts = list
                    .filter((o) => typeof o.id === "number")
                    .map((o) => ({
                        value: String(o.id!),
                        label: o.description ?? o.outcome_code,
                        id: o.id!,
                    }));
                setOutcomes(opts);
            } catch (err) {
                // don't block the UI; show a toast
                console.error("Failed to load outcomes", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    // clear cooldown interval on unmount
    useEffect(() => {
        return () => {
            if (cooldownIntervalRef.current) {
                clearInterval(cooldownIntervalRef.current);
                cooldownIntervalRef.current = null;
            }
            if (outcomeTimeoutRef.current) {
                clearTimeout(outcomeTimeoutRef.current);
                outcomeTimeoutRef.current = null;
            }
            setAwaitingRefetch(false);
        };
    }, []);

    // Poll for new bordereaux when none are available
    useEffect(() => {
        // clear any existing interval when dependencies change
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }

        // start polling only when there is no bordereau and we're not awaiting refetch
        if (!bordereauDetails && !awaitingRefetch && bpcUser?.id) {
            pollingIntervalRef.current = window.setInterval(() => {
                // avoid overlapping refetches if a previous refetch is still ongoing
                const fetching = queryClient.isFetching({
                    queryKey: ["current-bordereau", bpcUser?.id],
                });
                if (fetching > 0) return;

                queryClient.refetchQueries({
                    queryKey: ["current-bordereau", bpcUser?.id],
                });
            }, 2000) as unknown as number;
        }

        return () => {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        };
    }, [bordereauDetails, awaitingRefetch, bpcUser?.id, queryClient]);

    const handleAddComment = async (bordereauId: number, comment: string) => {
        try {
            setIsCommentSubmitting(true);
            await addCommentMutation.mutateAsync({ bordereauId, comment });
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    // Extracted handler to improve readability of the Confirm button
    const startCooldown = (label: string | null) => {
        setCooldownSeconds(cooldownTotal);
        setCooldownLabel(label);
        let remaining = cooldownTotal;

        if (cooldownIntervalRef.current) {
            clearInterval(cooldownIntervalRef.current);
        }

        cooldownIntervalRef.current = window.setInterval(() => {
            remaining -= 1;
            setCooldownSeconds(remaining);
            if (remaining <= 0) {
                if (cooldownIntervalRef.current) {
                    clearInterval(cooldownIntervalRef.current);
                    cooldownIntervalRef.current = null;
                }
                setCooldownSeconds(null);
                setCooldownLabel(null);
                queryClient.invalidateQueries({
                    queryKey: ["current-bordereau", bpcUser?.id],
                });
            }
        }, 1000) as unknown as number;
    };

    const scheduleOutcomeSubmission = async (
        bordereauId: number,
        outcomeId: number,
    ) => {
        // if (outcomeTimeoutRef.current) {
        //     clearTimeout(outcomeTimeoutRef.current);
        // }

        // outcomeTimeoutRef.current = window.setTimeout(async () => {
        try {
            await changeBordereauOutcome(bordereauId, outcomeId);
            toast.success("Outcome applied");

            // refetch related data
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["bpc-data"] }),
                queryClient.refetchQueries({
                    queryKey: ["current-bordereau", bpcUser?.id],
                }),
                queryClient.refetchQueries({ queryKey: ["bpc-status-list"] }),
            ]);
        } catch (err) {
            console.error(err);
            toast.error("Failed to apply outcome");
            queryClient.invalidateQueries({
                queryKey: ["current-bordereau", bpcUser?.id],
            });
        } finally {
            outcomeTimeoutRef.current = null;
            setAwaitingRefetch(false);
        }
        // }, cooldownTotal * 1000) as unknown as number;
    };

    const handleConfirmOutcome = () => {
        if (!bordereauDetails?.id || !outcomeToConfirm) return;

        const bordereauId = bordereauDetails.id as number;
        const outcomeId = outcomeToConfirm.id as number;
        const outcomeLabel = outcomeToConfirm.label;

        // close modal and remove bordereau from view immediately
        setShowOutcomeConfirm(false);
        setOutcomeToConfirm(null);
        queryClient.setQueryData(["current-bordereau", bpcUser?.id], null);

        // keep skeleton visible until refetch completes to avoid flicker
        setAwaitingRefetch(true);

        // start visual cooldown and schedule backend submission
        startCooldown(outcomeLabel ?? null);
        scheduleOutcomeSubmission(bordereauId, outcomeId);
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Use flex and min-h-full to ensure equal height for all columns */}
                <div className="col-span-12 xl:col-span-6 flex flex-col h-full">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6 flex-1">
                        <div className="rounded-2xl overflow-hidden shadow-md h-full flex flex-col">
                            <div className="text-black px-6 py-6 sm:px-8 sm:py-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-black/20 flex items-center justify-center">
                                            <User2Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm opacity-90 dark:text-white">
                                                Bordereau Payment Clerk
                                                Information
                                            </div>
                                            <div className="mt-1 text-4xl font-extrabold tracking-tight dark:text-white">
                                                {user?.firstname}{" "}
                                                {user?.lastname}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs opacity-90 dark:text-white">
                                            Email Address
                                        </div>
                                        <div className="mt-1 text-sm font-medium dark:text-white">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 px-6 py-5 sm:px-8 sm:py-6 mt-auto">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center">
                                            {bordereauDetails && (
                                                <Button
                                                    size="sm"
                                                    type="button"
                                                    onClick={() =>
                                                        setShowSupplierModal(
                                                            true,
                                                        )
                                                    }
                                                >
                                                    <FileText className="w-4 h-4 text-white-700 dark:text-white-200" />
                                                    <span className="hidden md:inline text-sm text-white-700 dark:text-white-200">
                                                        Supplier Documents
                                                    </span>
                                                </Button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        {bordereauDetails && (
                                            <div
                                                className={
                                                    cooldownSeconds !== null
                                                        ? "w-56 opacity-60 pointer-events-none"
                                                        : "w-56"
                                                }
                                            >
                                                <Select
                                                    options={outcomes}
                                                    placeholder="Select outcome"
                                                    value={""}
                                                    onChange={(val: string) => {
                                                        const id = Number(val);
                                                        const found =
                                                            outcomes.find(
                                                                (o) =>
                                                                    o.id === id,
                                                            );
                                                        if (!found) return;
                                                        setOutcomeToConfirm({
                                                            id: found.id,
                                                            label: found.label,
                                                        });
                                                        setShowOutcomeConfirm(
                                                            true,
                                                        );
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Add h-full and flex-col to both side columns for equal height */}
                <div className="col-span-12 xl:col-span-3 flex flex-col h-full">
                    <div className="sticky top-20 space-y-4 flex-1 flex flex-col">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3 sm:p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Time in Current status
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                Overview of your current bordereau status.
                            </p>

                            <div className="mt-6 flex justify-center flex-1 items-center">
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-gray-800 dark:text-white">
                                            {currentFmt.hh}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Hours
                                        </span>
                                    </div>
                                    <span className="mx-2 text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                        :
                                    </span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-gray-800 dark:text-white">
                                            {currentFmt.mm}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Minutes
                                        </span>
                                    </div>
                                    <span className="mx-2 text-2xl font-semibold text-gray-600 dark:text-gray-300">
                                        :
                                    </span>
                                    <div className="flex flex-col items-center">
                                        <span className="text-4xl font-bold text-gray-800 dark:text-white">
                                            {currentFmt.ss}
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            Seconds
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-300">
                                Total today: {totalFmt.hh}:{totalFmt.mm}:{totalFmt.ss}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-3 flex flex-col h-full">
                    <div className="sticky top-20 space-y-4 flex-1 flex flex-col">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3 sm:p-6 flex-1 flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Current Status
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                Overview of your current bordereau status.
                            </p>

                            <div className="mt-6">
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`inline-block w-3 h-3 rounded-full ${
                                            selectedStatus && selectedStatus.wfm
                                                ? "bg-emerald-500"
                                                : "bg-gray-300"
                                        }`}
                                        style={
                                            statusColorHex
                                                ? {
                                                      backgroundColor:
                                                          statusColorHex,
                                                  }
                                                : undefined
                                        }
                                    />
                                    <div className="ml-2 text-sm font-medium">
                                        {selectedStatus
                                            ? selectedStatus.status
                                            : "Unknown"}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                                <div
                                    className={
                                        isUpdatingStatus
                                            ? "w-48 opacity-60 pointer-events-none"
                                            : "w-48"
                                    }
                                >
                                    <Select
                                        options={statusOptions}
                                        placeholder={
                                            selectedStatus
                                                ? selectedStatus.status
                                                : "Change status"
                                        }
                                        value={selectedStatusId}
                                        onChange={async (val: string) => {
                                            const id = Number(val);
                                            setSelectedStatusId(val);

                                            // If selecting status 1 => ask for logout confirmation
                                            if (id === 1) {
                                                setShowLogoutConfirm(true);
                                                return;
                                            }

                                            // If there is a current bordereau assigned, confirm first
                                            if (bordereauDetails) {
                                                setPendingStatusId(id);
                                                setShowStatusConfirm(true);
                                                return;
                                            }

                                            // No bordereau assigned, proceed to call endpoint
                                            if (bpcUser?.id) {
                                                changeStatusMutation.mutate({
                                                    bpcId: bpcUser.id,
                                                    statusId: id,
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-2xl shadow-md dark:bg-gray-900">
                        {isLoggingOut && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="bg-black/40 absolute inset-0" />
                                <div className="relative z-10 flex items-center gap-3 bg-white dark:bg-gray-800 rounded-md px-4 py-3 shadow">
                                    <div className="w-6 h-6 border-4 border-t-transparent border-gray-300 rounded-full animate-spin" />
                                    <div className="text-sm">Logging out…</div>
                                </div>
                            </div>
                        )}
                        {cooldownSeconds !== null && (
                            <div className="mb-4 p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-yellow-800 dark:text-yellow-200">
                                        Outcome has succesfully updated. Please
                                        wait {cooldownLabel}s for the next
                                        queue. Remaining time: {cooldownSeconds}
                                        s
                                    </div>
                                    <div className="text-xs text-yellow-700 dark:text-yellow-100">
                                        {Math.max(0, cooldownSeconds)}s
                                    </div>
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-2 bg-emerald-500"
                                        style={{
                                            width: `${
                                                ((cooldownTotal -
                                                    (cooldownSeconds ?? 0)) /
                                                    cooldownTotal) *
                                                100
                                            }%`,
                                            ...(statusColorHex
                                                ? {
                                                      backgroundColor:
                                                          statusColorHex,
                                                  }
                                                : {}),
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/** Show loader while initial load or while refetching after outcome/status updates */}
                        {(() => {
                            const isRefetching = isRefetchingBordereau;
                            // Show the full skeleton only when loading initially or when we removed a bordereau and are awaiting the backend
                            // or when refetching while a bordereau was present (avoid flicker on "no bordereau" card)
                            const showSkeleton =
                                isLoading ||
                                awaitingRefetch ||
                                (isRefetching && !!bordereauDetails);

                            if (showSkeleton) {
                                return <BordereauSkeleton />;
                            }

                            if (bordereauDetails) {
                                return (
                                    <BordereauDetailsView
                                        isLoading={isLoading}
                                        bordereau={bordereauDetails}
                                    />
                                );
                            }

                            // no bordereau available design — keep this card stable during background refetches
                            return (
                                <div className="p-8 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 text-center relative">
                                    <div className="text-3xl font-semibold mb-2 text-gray-700 dark:text-white/90">
                                        Waiting for next bordereau
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Please wait whilst I fetch the next bordereau line item for you to process.
                                    </div>
                                    {/* <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                queryClient.refetchQueries({
                                                    queryKey: [
                                                        "current-bordereau",
                                                        bpcUser?.id,
                                                    ],
                                                })
                                            }
                                            className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700"
                                        >
                                            Refresh
                                        </button>
                                    </div> */}
                                    {/* {isRefetching && (
                                        <div className="absolute top-4 right-4 flex items-center gap-2 text-sm text-gray-500">
                                            <div className="w-4 h-4 border-2 border-t-transparent border-gray-400 rounded-full animate-spin" />
                                            <span>Checking for new bordereaux…</span>
                                        </div>
                                    )} */}
                                </div>
                            );
                        })()}
                        {/* Comment input at bottom only (comments list remains inside BordereauDetailsView) */}
                        {bordereauDetails ? (
                            <div className="mt-6">
                                <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                                    <textarea
                                        value={newCommentText}
                                        onChange={(e) =>
                                            setNewCommentText(e.target.value)
                                        }
                                        placeholder="Add a comment"
                                        className="w-full rounded-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                                        rows={3}
                                    />
                                    <div className="mt-2 flex items-center justify-end">
                                        <button
                                            onClick={async () => {
                                                if (
                                                    !newCommentText.trim() ||
                                                    !bordereauDetails?.id
                                                )
                                                    return;
                                                await handleAddComment(
                                                    bordereauDetails.id,
                                                    newCommentText.trim(),
                                                );
                                                setNewCommentText("");
                                            }}
                                            disabled={isCommentSubmitting}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 disabled:opacity-60"
                                        >
                                            {isCommentSubmitting
                                                ? "Adding..."
                                                : "Add Comment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {/* Supplier Documents modal */}
                        <Modal
                            isOpen={showSupplierModal}
                            onClose={() => setShowSupplierModal(false)}
                            className="w-auto! m-4"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Supplier Documents
                                </h3>
                                <SupplierDocumentsTable
                                    supplierId={bordereauDetails?.supplier?.id}
                                />
                            </div>
                        </Modal>

                        {/* Status change confirmation modal - shown when changing to an unavailable status while a bordereau is assigned */}
                        <Modal
                            isOpen={showStatusConfirm}
                            onClose={() => {
                                setShowStatusConfirm(false);
                                setPendingStatusId(null);
                            }}
                            className="w-auto! m-4"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Change Status
                                </h3>
                                <p className="my-8">
                                    You currently have a bordereau assigned. If
                                    you change to this status the clerk will be
                                    released and the bordereau returned to the
                                    queue. Proceed?
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                        onClick={() => {
                                            setShowStatusConfirm(false);
                                            setPendingStatusId(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                                        onClick={() => {
                                            if (
                                                !bpcUser?.id ||
                                                !pendingStatusId
                                            )
                                                return;
                                            setShowStatusConfirm(false);
                                            changeStatusMutation.mutate({
                                                bpcId: bpcUser.id,
                                                statusId: pendingStatusId,
                                            });
                                            setPendingStatusId(null);
                                        }}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        {/* Logout confirmation modal - shown when user selects status 1 */}
                        <Modal
                            isOpen={showLogoutConfirm}
                            onClose={() => setShowLogoutConfirm(false)}
                            className="w-auto! m-4"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Confirm Logout
                                </h3>
                                <p className="my-8">
                                    You are about to set your status to{" "}
                                    <strong>Log Off</strong>. Are you sure you
                                    want to proceed?
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                        onClick={() =>
                                            setShowLogoutConfirm(false)
                                        }
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-60"
                                        disabled={isLoggingOut}
                                        onClick={async () => {
                                            setIsLoggingOut(true);
                                            // keep the modal open briefly while spinner shows
                                            try {
                                                if (bpcUser?.id) {
                                                    await changeStatusMutation.mutateAsync(
                                                        {
                                                            bpcId: bpcUser.id,
                                                            statusId: 1,
                                                        },
                                                    );
                                                }
                                            } catch (err) {
                                                console.error(
                                                    "Failed to set status to 1",
                                                    err,
                                                );
                                            }

                                            try {
                                                await logout();
                                            } catch (err) {
                                                console.error(
                                                    "Logout failed",
                                                    err,
                                                );
                                            } finally {
                                                setIsLoggingOut(false);
                                                setShowLogoutConfirm(false);
                                            }
                                        }}
                                    >
                                        {isLoggingOut
                                            ? "Logging out..."
                                            : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        </Modal>

                        {/* Outcome confirmation modal */}
                        <Modal
                            isOpen={!!outcomeToConfirm && showOutcomeConfirm}
                            onClose={() => {
                                setShowOutcomeConfirm(false);
                                setOutcomeToConfirm(null);
                            }}
                            className="w-auto! m-4"
                        >
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-4">
                                    Confirm Outcome
                                </h3>
                                <p className="my-8">
                                    Are you sure you want to set outcome{" "}
                                    <strong>{outcomeToConfirm?.label}</strong>{" "}
                                    for this bordereau?
                                </p>
                                <div className="flex items-center justify-end gap-3">
                                    <button
                                        className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                        onClick={() => {
                                            setShowOutcomeConfirm(false);
                                            setOutcomeToConfirm(null);
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-4 py-2 rounded-md bg-rose-600 text-white hover:bg-rose-700"
                                        onClick={handleConfirmOutcome}
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </div>
                        </Modal>
                    </div>
                </div>
            </div>
        </>
    );
}
