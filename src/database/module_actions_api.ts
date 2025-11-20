import { IModuleActionBase, IModuleActionForm } from "@/types/ModuleActionSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchModuleActionList(): Promise<IModuleActionBase[]> {
    try {
        const response = await api.get("/module-actions");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchModuleActionById(id: string): Promise<IModuleActionForm> {
    try {
        const response = await api.get(`/module-actions/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertModuleAction(data: IModuleActionForm): Promise<void> {
    try {
        const response = data.id
            ? await api.put(`/module-actions/${data.id}`, data)
            : await api.post(`/module-actions`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteModuleAction(id: number): Promise<void> {
    try {
        const response = await api.delete(`/module-actions/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
