import api from "./api";
import { AxiosError } from "axios";
import { IWorkTypeForm } from "@/types/WorkTypeSchema";

export async function fetchWorkTypeList(): Promise<IWorkTypeForm[]> {
    try {
        const response = await api.get("/bordereau-validations");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchWorkType(id: string): Promise<IWorkTypeForm> {
    try {
        const response = await api.get(`/bordereau-validations/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertWorkType(data: IWorkTypeForm): Promise<IWorkTypeForm> {
    try {
        const response = data.id
            ? await api.put(`/bordereau-validations/${data.id}`, data)
            : await api.post(`/bordereau-validations`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteWorkType(id: number): Promise<void> {
    try {
        await api.delete(`/bordereau-validations/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
