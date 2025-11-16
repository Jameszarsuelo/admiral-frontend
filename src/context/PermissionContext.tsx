import { useEffect, useState, ReactNode } from "react";
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

    useEffect(() => {
        async function load() {
            try {
                if (user) {
                    setLoading(true);
                    const { data } = await api.get("/me/permissions");
                    console.log(data);
                    setPermissions(data.permissions);
                    setModules(data.modules);
                }
            } catch (err) {
                console.error("Failed to load permissions", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [user]);

    const can = (permission: string) => {
        return permissions.includes(permission);
    };

    const value = { loading, permissions, modules, can };

    return (
        <PermissionContext.Provider value={value}>
            {!loading && children}
        </PermissionContext.Provider>
    );
};
