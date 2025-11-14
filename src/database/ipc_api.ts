import { IIPCForm, IIPCSchema } from "@/types/IPCSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertIpc(ipcData: IIPCForm): Promise<void> {
    try {
        const response = ipcData.id 
            ? await api.put(`/ipc/${ipcData.id}`, ipcData)
            : await api.post(`/ipc`, ipcData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchIpcList(): Promise<IIPCSchema[]> {
    try {
        const response = await api.get(`/ipc`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchIpcById(id: string): Promise<IIPCForm> {
    try {
        const response = await api.get(`/ipc/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteIpc(id: number): Promise<void> {
    try {
        await api.delete(`/ipc/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
