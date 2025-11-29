import api from "./api";
import { AxiosError } from "axios";

export async function addBordereauComment(bordereauId: number, comment: string) {
    try {
        const response = await api.post(`/bordereau/${bordereauId}/comments`, { comment });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
