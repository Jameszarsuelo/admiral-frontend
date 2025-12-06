import { IUserBase, IUserCreate } from "@/types/UserSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertUser(userData: IUserCreate): Promise<IUserCreate> {
    try {
        const response = userData.id
            ? await api.put(`/users/${userData.id}`, userData)
            : await api.post(`/users`, userData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchUserById(id: string): Promise<IUserCreate> {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchUserList(): Promise<IUserBase[]> {
    try {
        const response = await api.get(`/users`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchSupplierUserList(): Promise<IUserBase[]> {
    try {
        const response = await api.get(`/fetchSupplierUsers`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteUser(id: number): Promise<void> {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchUserRelatedTables(): Promise<{
    user_types: { value: number; label: string }[];
    user_profiles: { value: number; label: string }[];
}> {
    try {
        const response = await api.get(`/user-related-tables`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
