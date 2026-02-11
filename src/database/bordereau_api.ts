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

export async function fetchBordereauList(params?: Record<string, unknown>): Promise<{
    data: IBordereauIndex[];
    total?: number;
    page?: number;
    per_page?: number;
    overdueCount: number;
    queryCount: number;
    inProgressCount: number;
    deadlineTomorrowCount: number;
    targetdateCount: number;
    queuedCount: number;
}> {
    try {
        const response = await api.get("/bordereau", { params });
        const payload = response.data as Record<string, unknown>;

        return {
            ...(payload as any),
            // Backend returns `targetDateCount`; frontend historically uses `targetdateCount`.
            targetdateCount:
                (payload as any).targetdateCount ?? (payload as any).targetDateCount ?? 0,
        };
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

export type TBordereauApiResponse =
    | IBordereauIndex
    | { bordereau: IBordereauIndex; validation_fields?: Record<string, unknown> }
    | null;

export async function fetchBpcCustomBordereauByBpcId(bpcId: number): Promise<TBordereauApiResponse> {
    try {
        const response = await api.get(`/get-bpc-custom-bordereau/${bpcId}`);
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
    bordereau_department_id?: string;
    bordereau_type_id?: string;
    bordereau?: string;
}): Promise<void> {
    try {
        const form = new FormData();
        form.append("file", data.document as File);

        if (data.admiral_invoice_type) {
            form.append("admiral_invoice_type", String(data.admiral_invoice_type));
        }
        if (data.supplier_id) {
            form.append("supplier_id", String(data.supplier_id));
        }
        if (data.bordereau) {
            form.append("bordereau", String(data.bordereau));
        }
        if (data.bordereau_department_id) {
            form.append("bordereau_department_id", String(data.bordereau_department_id));
        }
        if (data.bordereau_type_id) {
            form.append("bordereau_type_id", String(data.bordereau_type_id));
        }

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

export async function changeBordereauOutcome(bordereauId: number, outcomeId: number): Promise<void> {
    try {
        const response = await api.post(`/bordereau/${bordereauId}/outcome`, {
            outcome_id: outcomeId,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
