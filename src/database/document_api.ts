import { IDocumentSchema, IDocumentFormSchema } from "@/types/DocumentSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchDocumentList(): Promise<IDocumentSchema[]> {
    try {
        const response = await api.get(`/document`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchDocumentById(id: string): Promise<IDocumentFormSchema> {
    try {
        const response = await api.get(`/document/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function upsertDocument(documentData: IDocumentFormSchema): Promise<void> {
    try {
        const formData = new FormData();
        Object.entries(documentData).forEach(([key, value]) => {
            // if (key === "name" || value === undefined || value === null) {
            //     return;
            // }
            formData.append(key, String(value))
        });
        if (documentData.name) {
            const doc = documentData.name as File;
            formData.append("file", doc);
        }
        
        const response = documentData.id 
            ? await api.put(`/document/${documentData.id}`, documentData, {
                headers: {"Content-Type": "multipart/form-data"}
            })
            : await api.post(`/document`, documentData, {
                headers: {"Content-Type": "multipart/form-data"}
            });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
