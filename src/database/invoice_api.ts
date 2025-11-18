import { IInvoiceCreateSchema, IInvoiceSchema } from "@/types/BordereauSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchInvoiceViewData(): Promise<{
    suppliers: { value: number; label: string }[];
}> {
    try {
        const response = await api.get(`/invoice-view-data`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertInvoice(invoiceData: IInvoiceCreateSchema): Promise<void> {
    try {
        const response = invoiceData.id 
            ? await api.put(`/invoice/${invoiceData.id}`, invoiceData)
            : await api.post(`/invoice`, invoiceData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchInvoiceList(): Promise<IInvoiceSchema[]> {
    try {
        const response = await api.get("/invoice");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function uploadInvoiceCsv(file: File): Promise<void> {
    try {
        const form = new FormData();
        form.append("file", file);
        const response = await api.post("/invoice/upload-csv", form, {
            headers: {
                // Let axios set the proper multipart boundary
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
