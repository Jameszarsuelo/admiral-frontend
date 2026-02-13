import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import api, { ensureCsrfCookie } from "@/database/api";
import {
    AuthContext,
    type AuthContextType,
    type AuthUser,
} from "../types/AuthContextBase";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const queryClient = useQueryClient();

    const fetchUser = useCallback(async () => {
        try {
            const { data } = await api.get<AuthUser>("/user");
            setUser(data as AuthUser);
        } catch {
            setUser(null);
        }
    }, []);

    useEffect(() => {
        // On boot, try to get the current user; if not authenticated, user stays null
        (async () => {
            try {
                setLoading(true);
                const result = await fetchUser();
                console.log("Fetched user on auth init:", result);
            } catch {
                // ignore
            } finally {
                setLoading(false);
            }
        })();

        // Listen for 401/419 emitted by the api client to reset state if needed
        const onUnauthorized = () => setUser(null);
        window.addEventListener("auth:unauthorized", onUnauthorized);
        return () =>
            window.removeEventListener("auth:unauthorized", onUnauthorized);
    }, [fetchUser]);

    const login = useCallback(
        async (email: string, password: string) => {
            await ensureCsrfCookie();
            const { data } = await api.post("/login", { email, password });

            if (data?.two_fa_required) {
                return {
                    twoFaRequired: true as const,
                    challengeId: String(data.challenge_id),
                    twoFaType: Number(data.two_fa_type ?? 0),
                    destination:
                        typeof data.destination === "string"
                            ? data.destination
                            : undefined,
                };
            }

            await fetchUser();
            return { twoFaRequired: false as const };
        },
        [fetchUser],
    );

    const verifyTwoFactor = useCallback(
        async (challengeId: string, code: string) => {
            await ensureCsrfCookie();
            await api.post("/two-factor/verify", {
                challenge_id: challengeId,
                code,
            });
            await fetchUser();
        },
        [fetchUser],
    );

    const resendTwoFactor = useCallback(async (challengeId: string) => {
        await ensureCsrfCookie();
        const { data } = await api.post("/two-factor/resend", {
            challenge_id: challengeId,
        });
        return {
            challengeId: String(data.challenge_id),
            twoFaType: Number(data.two_fa_type ?? 0),
            destination:
                typeof data.destination === "string" ? data.destination : undefined,
        };
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/logout");
        } finally {
            setUser(null);
            try {
                queryClient.removeQueries({ queryKey: ["bpc-status-list"] });
                queryClient.removeQueries({ queryKey: ["current-bordereau"] });
            } catch (e) {
                console.error("Error clearing queries on logout:", e);
            }
        }
    }, [queryClient]);

    const value = useMemo<AuthContextType>(
        () => ({
            user,
            loading,
            login,
            verifyTwoFactor,
            resendTwoFactor,
            logout,
            refreshUser: fetchUser,
        }),
        [
            user,
            loading,
            login,
            verifyTwoFactor,
            resendTwoFactor,
            logout,
            fetchUser,
        ],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// use the hook from src/hooks/useAuth.ts to avoid fast-refresh warnings in dev
