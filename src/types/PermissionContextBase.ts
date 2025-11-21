import { createContext } from "react";

export type ModulePermission = {
    id: number;
    name: string;
    code: string;
    path: string | null;
    parent: string | null;
    actions: string[];
};

export type PermissionData = {
    user: UserPermissionData;
    modules: ModulePermission[];
    permissions: string[];
};

export type PermissionContextType = {
    loading: boolean;
    permissions: string[];
    modules: ModulePermission[];
    can: (permission: string) => boolean;
    reload?: () => Promise<void>;
};

type UserPermissionData = {
    email: string;
    firstname: string;
    lastname: string;
    role: string;
    user_profile_id: number;
};

export const PermissionContext = createContext<PermissionContextType | undefined>(undefined);
