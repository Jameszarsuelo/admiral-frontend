import { IModuleBase, IModuleForm } from "@/types/ModuleSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertModule(moduleData: IModuleForm): Promise<void> {
    try {
        const response = moduleData.id 
            ? await api.put(`/modules/${moduleData.id}`, moduleData)
            : await api.post(`/modules`, moduleData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchModuleList(): Promise<IModuleBase[]> {
    try {
        const response = await api.get("/modules");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchModuleById(id: string): Promise<IModuleForm> {
    try {
        const response = await api.get(`/modules/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
