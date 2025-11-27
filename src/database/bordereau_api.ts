import { IBordereauForm, IBordereauIndex } from "@/types/BordereauSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchBordereauViewData(): Promise<
    { value: number; label: string }[]
> {
    try {
        const response = await api.get(`/bordereau-view-data`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauValidationViewData(): Promise<
    { value: number; label: string }[]
> {
    try {
        const response = await api.get(`/bordereau-validations`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertBordereau(
    bordereauData: IBordereauForm,
): Promise<void> {
    try {
        const response = bordereauData.id
            ? await api.put(`/bordereau/${bordereauData.id}`, bordereauData)
            : await api.post(`/bordereau`, bordereauData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauList(): Promise<IBordereauIndex[]> {
    try {
        const response = await api.get("/bordereau");
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchBordereauById(id: number): Promise<IBordereauIndex> {
    try {
        const response = await api.get(`/bordereau/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function uploadBordereauCsv(file: File): Promise<void> {
    try {
        const form = new FormData();
        form.append("file", file);
        const response = await api.post("/bordereau/upload-csv", form, {
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
