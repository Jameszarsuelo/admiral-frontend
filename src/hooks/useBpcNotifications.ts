import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { echo } from "@/lib/echo";
import { IBordereauIndex } from "@/types/BordereauSchema";
import { IBPCStatus } from "@/types/BPCStatusSchema";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type Options = {
    onStatus?: (s: IBPCStatus) => void;
};

export default function useBpcNotifications(bpcId?: number, options?: Options) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const lastToastRef = useRef<number | null>(undefined);

    useEffect(() => {
        if (!bpcId) return;

        const channelName = `bpc.${bpcId}`;

        const listener = (data: unknown) => {
            const obj = data as {
                payload?: { bordereau?: IBordereauIndex; bpcStatus?: IBPCStatus };
            };

            const incomingBordereau = obj?.payload?.bordereau ?? null;
            const incomingStatus = obj?.payload?.bpcStatus;

            // Update bpc-data cache and notify caller about status
            if (incomingStatus) {
                queryClient.setQueryData(["bpc-data"], (old: unknown) => {
                    if (!old) return old;
                    return {
                        ...old,
                        bpc_status_id: incomingStatus.id,
                        status_id: incomingStatus.id,
                        bpcStatus: incomingStatus,
                    };
                });

                options?.onStatus?.(incomingStatus);
            }

            const cacheKey = ["current-bordereau", bpcId] as const;

            if (incomingBordereau) {
                const current = queryClient.getQueryData<IBordereauIndex | null>(cacheKey);
                if (current?.id !== incomingBordereau.id) {
                    queryClient.setQueryData(cacheKey, incomingBordereau);

                    // show toast only for user_type_id === 3
                    if (user?.user_type_id === 3 && lastToastRef.current !== incomingBordereau.id) {
                        toast("New bordereau received", {
                            action: {
                                label: "Open",
                                onClick: () => navigate("/workplace"),
                            },
                        });
                        lastToastRef.current = incomingBordereau.id;
                    }
                }
            } else {
                queryClient.invalidateQueries({ queryKey: cacheKey });
            }
        };

        echo.channel(channelName).listen(".BordeareauNotification", listener);

        return () => {
            try {
                echo.leave(channelName);
            } catch {
                // ignore
            }
        };
    }, [bpcId, queryClient, options, user, navigate]);
}
