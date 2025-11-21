import { IDocumentTypeSchema } from "@/types/DocumentSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchDocumentTypeList(): Promise<IDocumentTypeSchema[]> {
    try {
        const response = await api.get(`/document-type`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

