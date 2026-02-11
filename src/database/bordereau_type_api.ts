import api from "./api";
import { AxiosError } from "axios";
import { IBordereauTypeForm } from "@/types/BordereauTypeSchema";

export async function fetchBordereauTypeList(): Promise<IBordereauTypeForm[]> {
    try {
        const response = await api.get("/bordereau-types");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauType(id: string): Promise<IBordereauTypeForm> {
    try {
        const response = await api.get(`/bordereau-types/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertBordereauType(
    bordereauTypeData: IBordereauTypeForm,
): Promise<IBordereauTypeForm> {
    try {
        const response = bordereauTypeData.id
            ? await api.put(`/bordereau-types/${bordereauTypeData.id}`, bordereauTypeData)
            : await api.post(`/bordereau-types`, bordereauTypeData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteBordereauType(id: number): Promise<void> {
    try {
        await api.delete(`/bordereau-types/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
