import { AxiosError } from "axios";
import api from "./api";
import { IRoleBase, IRoleForm } from "@/types/RoleSchema";

export async function fetchRoleList(): Promise<IRoleBase[]> {
    try {
        const response = await api.get("/roles");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchRoleById(id: string): Promise<IRoleBase> {
    try {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertRole(data: IRoleForm): Promise<IRoleBase> {
    try {
        const response = data.id
            ? await api.put(`/roles/${data.id}`, data)
            : await api.post(`/roles`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteRole(id: number): Promise<void> {
    try {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchRoleOptions(): Promise<{ label: string; value: number }[]> {
    try {
        const response = await api.get("/role-options");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}