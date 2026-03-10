import api from "./api";
import { AxiosError } from "axios";

export interface UploadExceptionRow {
    bordereau_id: number;
    upload_batch_number: number;
    supplier_id: number;
    bordereau_name: string;
    supplier: string;
    uploaded_by: string;
    uploaded_on: string;
    ideal_process: string;
    deadline: string;
    is_paused: boolean;
    can_delete: boolean;
}

export interface UploadExceptionsListResponse {
    rows: UploadExceptionRow[];
    total?: number;
    page?: number;
    per_page?: number;
}

export interface UploadExceptionActivityRow {
    bordereau_id: number;
    supplier: string;
    bordereau_name: string;
    claim_number: string;
    invoice_number: string;
    name: string;
    customer_name: string;
    bordereau_status_id: number;
    bordereau_status: string;
    comments: string;
    uploaded_on: string;
    target_process_by: string;
}

export interface UploadExceptionActivitiesResponse {
    upload_batch_number: number;
    only_errors: boolean;
    rows: UploadExceptionActivityRow[];
    total?: number;
    page?: number;
    per_page?: number;
}

export type FetchUploadExceptionsParams = {
    page?: number;
    per_page?: number;
    search?: string;
};

export async function fetchUploadExceptions(
    params: FetchUploadExceptionsParams = {},
): Promise<UploadExceptionsListResponse> {
    try {
        const response = await api.get(`/upload-exceptions`, { params });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export type FetchUploadExceptionActivitiesParams = {
    page?: number;
    per_page?: number;
    search?: string;
    only_errors?: boolean;
};

export async function fetchUploadExceptionActivities(
    uploadBatchNumber: number,
    params: FetchUploadExceptionActivitiesParams = {},
): Promise<UploadExceptionActivitiesResponse> {
    try {
        const response = await api.get(
            `/upload-exceptions/${uploadBatchNumber}/activities`,
            { params },
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
