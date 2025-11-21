import { PermissionContext } from "@/types/PermissionContextBase";
import { useContext } from "react";

export function usePermissions() {
    const ctx = useContext(PermissionContext);
    if (!ctx)
        throw new Error(
            "usePermissions must be used inside PermissionProvider",
        );
    return ctx;
}
