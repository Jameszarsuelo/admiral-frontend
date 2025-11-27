import { fetchBpcStatusList } from "@/database/bpc_status_api";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { User2Icon } from "lucide-react";
import Select from "@/components/form/Select";
import { useMemo, useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { addBordereauComment } from "@/database/comment_api";
import { IBPCStatus } from "@/types/BPCStatusSchema";
import { fetchBpcByUserId } from "@/database/bpc_api";
import { IBPCSchema } from "@/types/BPCSchema";

import BordereauDetailsView from "../BordereauDetail/BordereauDetailsView";
import { IBordereauIndex } from "@/types/BordereauSchema";
import { fetchBpcBordereauByBpcId } from "@/database/bordereau_api";
import useBpcNotifications from "@/hooks/useBpcNotifications";

export default function Workplace() {
    const { user } = useAuth();

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

    const statusOptions = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        return list.map((s) => ({
            value: String(s.id),
            label: s.status,
        }));
    }, [bpcStatusData]);

    const [selectedStatusId, setSelectedStatusId] = useState<string>("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    
    const [newCommentText, setNewCommentText] = useState("");
    

    const { data: bordereauDetails, isLoading } = useQuery<IBordereauIndex | null>({
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
    }, [bpcUser]);

    const selectedStatus = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        return list.find((s) => String(s.id) === selectedStatusId);
    }, [bpcStatusData, selectedStatusId]);

    // subscribe to notifications and update caches / status
    useBpcNotifications(bpcUser?.id, {
        onStatus: (s) => setSelectedStatusId(String(s.id)),
    });

    const queryClient = useQueryClient();
    const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);

    const handleAddComment = async (bordereauId: number, comment: string) => {
        try {
            setIsCommentSubmitting(true);
            await addBordereauComment(bordereauId, comment);
            await queryClient.invalidateQueries({ queryKey: ["current-bordereau", bpcUser?.id] });
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setIsCommentSubmitting(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-10 xl:col-span-10">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
                        <div className="rounded-2xl overflow-hidden shadow-md">
                            <div className=" text-black px-6 py-6 sm:px-8 sm:py-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-black/20 flex items-center justify-center">
                                            <User2Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm opacity-90">
                                                Bordereau Payment Clerk
                                                Information
                                            </div>
                                            <div className="mt-1 text-4xl font-extrabold tracking-tight">
                                                {user?.firstname}{" "}
                                                {user?.lastname}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs opacity-90">
                                            Email Address
                                        </div>
                                        <div className="mt-1 text-sm font-medium">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 px-6 py-5 sm:px-8 sm:py-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                    </div>

                                    <div className="hidden md:flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-block w-3 h-3 rounded-full ${
                                                    selectedStatus &&
                                                    selectedStatus.wfm
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-300"
                                                }`}
                                            />
                                            <div className="ml-2 text-sm font-medium">
                                                {selectedStatus
                                                    ? selectedStatus.status
                                                    : "Unknown"}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2">
                                            <div className={isUpdatingStatus ? "w-48 opacity-60 pointer-events-none" : "w-48"}>
                                                <Select
                                                    options={statusOptions}
                                                    placeholder={
                                                        selectedStatus
                                                            ? selectedStatus.status
                                                            : "Change status"
                                                    }
                                                    value={selectedStatusId}
                                                    onChange={async (
                                                        val: string,
                                                    ) => {
                                                        setSelectedStatusId(val);
                                                        setIsUpdatingStatus(true);
                                                        console.log(
                                                            "Status change requested",
                                                            {
                                                                user_id: user?.id,
                                                                status_id:
                                                                    Number(val),
                                                            },
                                                        );
                                                        setTimeout(
                                                            () =>
                                                                setIsUpdatingStatus(
                                                                    false,
                                                                ),
                                                            600,
                                                        );
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-2">
                    <div className="sticky top-20 space-y-4">
                        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] sm:p-6">
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
                                            selectedStatus &&
                                            selectedStatus.wfm
                                                ? "bg-emerald-500"
                                                : "bg-gray-300"
                                        }`}
                                    />
                                    <div className="ml-2 text-sm font-medium">
                                        {selectedStatus
                                            ? selectedStatus.status
                                            : "Unknown"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-full">
                    <div className="grid grid-cols-1 gap-4 bg-white p-6 rounded-2xl shadow-md dark:bg-gray-900">
                        {bordereauDetails != null ? (
                            <BordereauDetailsView
                                isLoading={isLoading}
                                bordereau={bordereauDetails}
                            />
                        ) : null}
                        {/* Comment input at bottom only (comments list remains inside BordereauDetailsView) */}
                        {bordereauDetails ? (
                            <div className="mt-6">
                                <div className="p-4 border border-gray-200 rounded-2xl dark:border-gray-800">
                                    <textarea
                                        value={newCommentText}
                                        onChange={(e) => setNewCommentText(e.target.value)}
                                        placeholder="Add a comment"
                                        className="w-full rounded-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                                        rows={3}
                                    />
                                    <div className="mt-2 flex items-center justify-end">
                                        <button
                                            onClick={async () => {
                                                if (!newCommentText.trim() || !bordereauDetails?.id) return;
                                                await handleAddComment(bordereauDetails.id, newCommentText.trim());
                                                setNewCommentText("");
                                            }}
                                            disabled={isCommentSubmitting}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-cyan-600 text-white text-sm hover:bg-cyan-700 disabled:opacity-60"
                                        >
                                            {isCommentSubmitting ? "Adding..." : "Add Comment"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                        {/* supplier modal removed — reverted changes */}
                    </div>
                </div>
            </div>
        </>
    );
}
