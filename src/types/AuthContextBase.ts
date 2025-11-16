import { createContext } from "react";

// Minimal user shape; align with your backend response as needed
export type AuthUser = {
    id: number;
    firstname?: string | null;
    lastname?: string | null;
    email?: string | null;
    user_type_id?: number;
    [key: string]: unknown;
};

export type AuthContextType = {
    user: AuthUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined,
);
