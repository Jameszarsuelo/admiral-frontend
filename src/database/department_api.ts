import api from "./api";
import { AxiosError } from "axios";
import { IDepartmentForm } from "@/types/DepartmentSchema";

export async function fetchDepartmentList(): Promise<IDepartmentForm[]> {
    try {
        const response = await api.get("/departments");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchDepartment(id: string): Promise<IDepartmentForm> {
    try {
        const response = await api.get(`/departments/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertDepartment(
    departmentData: IDepartmentForm,
): Promise<IDepartmentForm> {
    try {
        const response = departmentData.id
            ? await api.put(`/departments/${departmentData.id}`, departmentData)
            : await api.post(`/departments`, departmentData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteDepartment(id: number): Promise<void> {
    try {
        await api.delete(`/departments/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
