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
            await api.post("/login", { email, password });
            await fetchUser();
        },
        [fetchUser],
    );

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
            logout,
            refreshUser: fetchUser,
        }),
        [user, loading, login, logout, fetchUser],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// use the hook from src/hooks/useAuth.ts to avoid fast-refresh warnings in dev
