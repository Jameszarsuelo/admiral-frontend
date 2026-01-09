import { IDocumentSchema, IDocumentFormSchema } from "@/types/DocumentSchema";
import api from "./api";
import { AxiosError } from "axios";

export async function fetchDocumentList(include_obsolete?: string | number | boolean): Promise<IDocumentSchema[]> {
    try {
        const params: any = {};
        if (include_obsolete !== undefined && include_obsolete !== null) {
            params.include_obsolete = include_obsolete;
        }
        const response = await api.get(`/document`, { params });
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
        console.log(response.data);
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
        const formatDate = (d: Date) => {
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            return `${yyyy}-${mm}-${dd}`;
        };

        // Normalize expiry_date explicitly to avoid browser-dependent parsing
        if (documentData.expiry_date !== undefined && documentData.expiry_date !== null && documentData.expiry_date !== "") {
            const raw = documentData.expiry_date as any;
            let normalized: string | null = null;

            // dayjs/moment object
            if (raw && typeof raw === 'object' && typeof (raw as any).toDate === 'function') {
                normalized = formatDate((raw as any).toDate());
            } else if (raw instanceof Date) {
                normalized = formatDate(raw);
            } else if (typeof raw === 'string') {
                const match = raw.match(/^(\d{4}-\d{2}-\d{2})/);
                if (match) {
                    normalized = match[1];
                } else {
                    const parsed = new Date(raw);
                    if (!isNaN(parsed.getTime())) {
                        normalized = formatDate(parsed);
                    }
                }
            } else if (typeof raw === 'number') {
                const parsed = new Date(raw);
                if (!isNaN(parsed.getTime())) {
                    normalized = formatDate(parsed);
                }
            }

            if (normalized) {
                formData.append('expiry_date', normalized);
            }
        }

        Object.entries(documentData).forEach(([key, value]) => {
            // if (key === "name" || value === undefined || value === null) {
            //     return;
            // }
            // Only append values that are not undefined or null
            if (key === 'name' || key === 'expiry_date') return;

            // Handle booleans as 1/0 for Laravel boolean validation
            if (typeof value === 'boolean') {
                formData.append(key, value ? '1' : '0');
                return;
            }

            // If value is a Date, convert to ISO string fallback
            if (value instanceof Date) {
                formData.append(key, value.toISOString());
            } else if (value !== undefined && value !== null) {
                formData.append(key, String(value));
            }
        });
        if (documentData.name && documentData.name instanceof File) {
            const doc = documentData.name as File;
            // backend expects uploaded file field to be named 'name'
            formData.append("name", doc);
        }

        let response;
        if (documentData.id) {
            // Use POST with _method=PUT so PHP properly parses multipart/form-data
            formData.append('_method', 'PUT');
            response = await api.post(`/document/${documentData.id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        } else {
            response = await api.post(`/document`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
        }
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function deleteDocument(id: number): Promise<void> {
    try {
        await api.delete(`/document/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
