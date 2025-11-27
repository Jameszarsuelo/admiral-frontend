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

export async function fetchBpcBordereauByBpcId(bpcId: number): Promise<IBordereauIndex | null> {
    try {
        const response = await api.get(`/get-bpc-bordereau/${bpcId}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            // If backend returns 404 or no current bordereau, return null
            if (error.response.status === 404) return null;
            throw error.response.data;
        }
        throw error;
    }
}

export async function uploadBordereauCsv(data: {
    document?: File | null;
    admiral_invoice_type?: string;
    supplier_id?: string;
    bordereau?: string;
}): Promise<void> {
    try {
        const form = new FormData();
        form.append("file", data.document as File);
        form.append("admiral_invoice_type", String(data.admiral_invoice_type));
        form.append("supplier_id", String(data.supplier_id));
        form.append("bordereau", String(data.bordereau));

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
