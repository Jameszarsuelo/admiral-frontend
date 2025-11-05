import { IUserForm } from "@/interface/IUser";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertUser(userData: IUserForm): Promise<IUserForm> {
    try {
        const response = await api.post(`/user`, userData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
