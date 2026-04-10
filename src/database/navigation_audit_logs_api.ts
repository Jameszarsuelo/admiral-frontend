import api from "./api";
import { AxiosError } from "axios";

export interface NavigationAuditLogRow {
    id: number;
    created_at: string;
    user_id: number | null;
    user_name: string;
    role: string;
    page: string;
    method: string;
    uri: string;
    allowed: boolean;
    ip_address: string;
    user_agent: string;
}

export interface NavigationAuditLogsResponse {
    rows: NavigationAuditLogRow[];
    total?: number;
    page?: number;
    per_page?: number;
    role_options: string[];
    user_options: string[];
}

export type FetchNavigationAuditLogsParams = {
    page?: number;
    per_page?: number;
    search?: string;
    allowed?: string;
    role?: string;
    user?: string;
    date_from?: string;
    date_to?: string;
};

export async function fetchNavigationAuditLogs(
    params: FetchNavigationAuditLogsParams = {},
): Promise<NavigationAuditLogsResponse> {
    try {
        const response = await api.get(`/navigation-audit-logs`, { params });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function recordNavigationAuditLog(payload: {
    page: string;
    method: string;
    uri: string;
    allowed: boolean;
}): Promise<void> {
    try {
        await api.post(`/navigation-audit-logs/track`, payload);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}