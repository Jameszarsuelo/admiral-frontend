import { IBPCForm, IBPCSchema } from "@/types/BPCSchema";
import api from "./api";
import { AxiosError } from "axios";
import { TimerSegmentToday } from "@/types/TimerSegment";

export async function upsertBpc(bpcData: IBPCForm): Promise<void> {
    try {
        const response = bpcData.id 
            ? await api.put(`/bpc/${bpcData.id}`, bpcData)
            : await api.post(`/bpc`, bpcData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBpcList(): Promise<IBPCSchema[]> {
    try {
        const response = await api.get(`/bpc`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBpcById(id: string): Promise<IBPCForm> {
    try {
        const response = await api.get(`/bpc/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteBpc(id: number): Promise<void> {
    try {
        await api.delete(`/bpc/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function fetchBpcOptions(): Promise<{ value: number; label: string }[]> {
    try {
        const response = await api.get(`/bpc-options`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBpcByUserId(id: number): Promise<IBPCSchema> {
    try {
        const response = await api.get(`/bpc-details/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function changeBpcStatus(
    bpcId: number,
    statusId: number,
): Promise<{bpc: IBPCSchema}> {
    try {
        const response = await api.post(`/bpc/${bpcId}/status`, {
            bpc_status_id: statusId,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBpcTimerToday(bpcId: number): Promise<TimerSegmentToday> {
    try {
        const response = await api.get(`/bpc/${bpcId}/timer/today`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
