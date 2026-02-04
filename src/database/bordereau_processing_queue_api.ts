import api from "./api";
import { AxiosError } from "axios";
import {
    IBordereauProcessingQueueBase,
    IBordereauProcessingQueueForm,
} from "@/types/BordereauProcessingQueueSchema";

const BASE = "/bordereau-processing-queues";

export async function fetchBordereauProcessingQueueList(): Promise<
    IBordereauProcessingQueueBase[]
> {
    try {
        const response = await api.get(BASE);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauProcessingQueueById(
    id: string,
): Promise<IBordereauProcessingQueueForm> {
    try {
        const response = await api.get(`${BASE}/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertBordereauProcessingQueue(
    data: IBordereauProcessingQueueForm,
): Promise<void> {
    try {
        const response = data.id
            ? await api.put(`${BASE}/${data.id}`, data)
            : await api.post(BASE, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteBordereauProcessingQueue(id: number): Promise<void> {
    try {
        const response = await api.delete(`${BASE}/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
