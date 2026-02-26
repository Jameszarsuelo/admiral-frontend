import api from "./api";
import { AxiosError } from "axios";
import { HeadcountRow } from "@/data/HeadcountHeaders";

export interface HeadcountTodayResponse {
    date: string;
    online_count: number;
    rows: HeadcountRow[];
}

export interface ProductionLineSupplierRow {
    supplier_id: number;
    supplier_name: string;
    buckets: Record<string, number>;
    total_outstanding: number;
}

export interface ProductionLineTodayResponse {
    date: string;
    oldest_queued_days: number;
    bucket_days: number[];
    rows: ProductionLineSupplierRow[];
}

export interface OutstandingQueryRow {
    id: number;
    bordereau: string;
    supplier_name: string;
    claim_number: string;
    current_status: string;
    agent_name: string;
    last_comment: string;
    target_payment_date: string | null;
    deadline_payment_date: string | null;
}

export interface OutstandingQueriesResponse {
    query_activities_count: number;
    rows: OutstandingQueryRow[];
}

export interface ForecastRow {
    bordereau_id: number;
    supplier_id: number;
    supplier: string;
    bordereau_name: string;
    status: string;
    activities_outstanding: number;
    agents_qualified: number;
    aht_completed_seconds: number;
    aht_completed: string;
    duration_seconds: number;
    duration: string;
    status_label_raw: string;
}

export interface ForecastSnapshotResponse {
    date: string;
    hours_worked_per_day: number;
    active_agents_count: number;
    projected_days: number;
    rows: ForecastRow[];
}

export interface OverviewQueueRow {
    bordereau_id: number;
    supplier_id: number;
    import_date: string;
    department: string;
    supplier: string;
    work_type: string;
    bdx_type: string;
    bordereau_name: string;
    bordereau_status: string;
    is_completed: boolean;
}

export interface OverviewQueueListResponse {
    include_completed: boolean;
    rows: OverviewQueueRow[];
}

export interface TimTodayRow {
    bordereau_id: number;
    supplier_id: number;
    supplier: string;
    bordereau_name: string;
    activities_count: number;
    completed_count: number;
    success_count: number;
    query_count: number;
    agents_count: number;
    aht_completed_seconds: number;
    aht_completed: string;
    aht_queried_seconds: number;
    aht_queried: string;
}

export interface TimTodaySnapshotResponse {
    date: string;
    headline_aht_seconds: number;
    headline_aht: string;
    rows: TimTodayRow[];
}

export interface TimBotMonth {
    key: string;
    label: string;
}

export interface TimBotRow {
    supplier_id: number;
    supplier: string;
    months: Record<string, string>;
    grand_total_seconds: number;
    grand_total: string;
}

export interface TimBotSnapshotResponse {
    headline_aht_seconds: number;
    headline_aht: string;
    months: TimBotMonth[];
    rows: TimBotRow[];
}

export async function fetchHeadcountToday(): Promise<HeadcountTodayResponse> {
    try {
        const response = await api.get(`/overview/headcount/today`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchProductionLineToday(): Promise<ProductionLineTodayResponse> {
    try {
        const response = await api.get(`/overview/production-line/today`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchOutstandingQueries(): Promise<OutstandingQueriesResponse> {
    try {
        const response = await api.get(`/overview/outstanding-queries`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchForecastSnapshot(): Promise<ForecastSnapshotResponse> {
    try {
        const response = await api.get(`/overview/forecast`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchOverviewQueueList(includeCompleted: boolean): Promise<OverviewQueueListResponse> {
    try {
        const response = await api.get(`/overview/queue-list`, {
            params: {
                include_completed: includeCompleted,
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchTimTodaySnapshot(): Promise<TimTodaySnapshotResponse> {
    try {
        const response = await api.get(`/overview/tim-today`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchTimBotSnapshot(): Promise<TimBotSnapshotResponse> {
    try {
        const response = await api.get(`/overview/tim-bot`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
