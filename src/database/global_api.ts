import api from "./api";
import { AxiosError } from "axios";

export async function fetchMePermissions(): Promise<{
    suppliers: { value: number; label: string }[];
}> {
    try {
        const response = await api.get(`/me/permissions`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
