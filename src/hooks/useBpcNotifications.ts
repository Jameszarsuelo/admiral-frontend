import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { echo } from "@/lib/echo";
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
    const onStatusRef = useRef<Options | undefined>(options);

    // keep a stable ref to the onStatus callback to avoid re-subscribing on every render
    useEffect(() => {
        onStatusRef.current = options;
    }, [options]);

    useEffect(() => {
        if (!bpcId) return;

        const channelName = `bpc.${bpcId}`;

        const listener = (data: unknown) => {
            // Support both shapes: { payload: { ... } } and top-level { ... }
            const evt = (data as any) ?? {};
            const payload = evt.payload ?? evt;

            // DEBUG: log incoming payload to help diagnose missing dynamic fields
            // Remove or guard these logs in production
            try {
                // eslint-disable-next-line no-console
                console.debug("useBpcNotifications: incoming payload for bpc.", bpcId, payload);
            } catch (e) {
                // ignore logging failures
            }

            const incomingBordereau = payload?.bordereau ?? null;
            const incomingStatus = payload?.bpcStatus ?? payload?.bpc_status ?? null;

            // Update bpc-data cache and notify caller about status
            if (incomingStatus) {
                queryClient.setQueryData(["bpc-data"], (old: any) => {
                    if (!old) return old;
                    return {
                        ...old,
                        bpc_status_id: incomingStatus.id,
                        status_id: incomingStatus.id,
                        bpcStatus: incomingStatus,
                    };
                });

                onStatusRef.current?.onStatus?.(incomingStatus);
            }

            const cacheKey = ["current-bordereau", bpcId] as const;

            // Only invalidate the current-bordereau cache when the event explicitly
            // includes a `bordereau` key set to null/empty. If the event contains no
            // bordereau property (e.g. only a status update), leave the cache alone.
            if (Object.prototype.hasOwnProperty.call(payload, "bordereau")) {
                // For consistency with the fetch endpoint, store the bordereau
                // in the wrapped shape `{ bordereau, validation_fields }` so
                // components that expect the wrapped response update correctly.
                if (incomingBordereau) {
                    const wrapped = {
                        bordereau: incomingBordereau,
                        validation_fields: payload?.validation_fields ?? null,
                    };

                    const current = queryClient.getQueryData<any>(cacheKey);
                    const currentId = current && (current.bordereau?.id ?? current.id);

                    if (currentId !== incomingBordereau.id) {
                        queryClient.setQueryData(cacheKey, wrapped);

                        try {
                            // eslint-disable-next-line no-console
                            console.debug("useBpcNotifications: setQueryData for current-bordereau:", queryClient.getQueryData(cacheKey));
                        } catch (e) {
                            // ignore
                        }

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
    }, [bpcId, queryClient, user, navigate]);
}
