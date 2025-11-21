import { useEffect, useState, ReactNode, useCallback } from "react";
import api from "@/database/api";
import {
    ModulePermission,
    PermissionContext,
} from "@/types/PermissionContextBase";
import { useAuth } from "@/hooks/useAuth";

export const PermissionProvider = ({ children }: { children: ReactNode }) => {
    const [loading, setLoading] = useState(true);
    const [permissions, setPermissions] = useState<string[]>([]);
    const [modules, setModules] = useState<ModulePermission[]>([]);
    const { user } = useAuth();

    const reload = useCallback(async () => {
        try {
            if (user) {
                setLoading(true);
                const { data } = await api.get("/me/permissions");
                setPermissions(data.permissions);
                setModules(data.modules);
            } else {
                setPermissions([]);
                setModules([]);
            }
        } catch (err) {
            console.error("Failed to load permissions", err);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        reload();
    }, [user, reload]);

    const can = (permission: string) => {
        return permissions.includes(permission);
    };

    const value = { loading, permissions, modules, can, reload };

    return (
        <PermissionContext.Provider value={value}>
            {!loading && children}
        </PermissionContext.Provider>
    );
};
