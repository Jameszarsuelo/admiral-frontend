import { IDocumentVisibilitySchema } from "@/types/DocumentSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchDocumentVisibilityList(): Promise<IDocumentVisibilitySchema[]> {
    try {
        const response = await api.get(`/document-visibilities`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}