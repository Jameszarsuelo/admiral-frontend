import { IPC } from "@/types/ipc";
import api from "./api";

export async function upsertIpc(ipcData: IPC): Promise<IPC> {
    try {
        const response = await api.post(`/ipc`, ipcData);
        return response.data;
    } catch (error) {
        console.error("Error upserting IPC:", error);
        throw error;
    }
}
