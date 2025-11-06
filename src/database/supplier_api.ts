import api from "./api";
import { AxiosError } from "axios";
import { ISupplierFormSchema, ISupplierSchema } from "@/types/suppliers";

export async function upsertSupplier(supplierData: ISupplierFormSchema): Promise<ISupplierFormSchema> {
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

export async function fetchSupplierList(): Promise<ISupplierSchema[]> {
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

export async function fetchSupplierById(id: string): Promise<ISupplierSchema> {
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
