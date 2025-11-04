import { IPC } from "@/types/ipc";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertIpc(ipcData: IPC): Promise<IPC> {
    try {
        const response = await api.post(`/ipc`, ipcData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
