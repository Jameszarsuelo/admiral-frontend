import api from "./api";
import { AxiosError } from "axios";
import { IBordereauStatus } from "@/types/BordereauStatusSchema";

export async function fetchBordereauStatusList(): Promise<IBordereauStatus[]> {
    try {
        const response = await api.get("/bordereau-status");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauStatusesAll(): Promise<IBordereauStatus[]> {
    try {
        const response = await api.get("/bordereau-statuses-all");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
