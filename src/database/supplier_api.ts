import api from "./api";
import { AxiosError } from "axios";
import { IUser } from "@/types/user";
import { SupplierResponse } from "@/types/supplier";

export async function upsertSupplier(supplierData: IUser): Promise<IUser> {
    try {
        const response = supplierData.id
            ? await api.put(`/supplier/${supplierData.id}`, supplierData)
            : await api.post(`/supplier`, supplierData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchSupplierList(): Promise<SupplierResponse[]> {
    try {
        const response = await api.get(`/supplier`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchSupplierById(id: string): Promise<SupplierResponse> {
    try {
        const response = await api.get(`/supplier/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteSupplier(id: number): Promise<void> {
    try {
        await api.delete(`/supplier/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
