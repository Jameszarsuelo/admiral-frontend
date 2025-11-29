import api from "./api";
import { AxiosError } from "axios";
import { IBPCStatus } from "@/types/BPCStatusSchema";

export async function fetchBpcStatusList(): Promise<IBPCStatus[]> {
    try {
        const response = await api.get("/bpc-status");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
