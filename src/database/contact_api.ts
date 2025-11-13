import { IContactCreateSchema } from "@/types/ContactSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertContact(
    contactData: IContactCreateSchema,
): Promise<IContactCreateSchema> {
    try {
        const response = contactData.id
            ? await api.put(`/contact/${contactData.id}`, contactData)
            : await api.post(`/contact`, contactData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchContactList(): Promise<IContactCreateSchema[]> {
    try {
        const response = await api.get("/contact");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchContactById(id: string): Promise<IContactCreateSchema> {
    try {
        const response = await api.get(`/contact/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
