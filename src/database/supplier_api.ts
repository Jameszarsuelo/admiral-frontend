import api from "./api";
import { AxiosError } from "axios";
import { ISupplierFormSchema, ISupplierSchema } from "@/types/SupplierSchema";
import { IContactCreateSchema, IContactSchema } from "@/types/ContactSchema";

export async function upsertSupplier(
    supplierData: ISupplierFormSchema,
): Promise<ISupplierFormSchema> {
    try {
        const hasFile = supplierData.document?.name instanceof File;

        if (!hasFile) {
            const response = supplierData.id
                ? await api.put(`/supplier/${supplierData.id}`, supplierData)
                : await api.post(`/supplier`, supplierData);
            return response.data;
        }

        const formData = new FormData();

        Object.entries(supplierData).forEach(([key, value]) => {
            if (key === "document" || value === undefined || value === null)
                return;
            formData.append(key, String(value));
        });

        if (supplierData.document) {
            const doc = supplierData.document as Record<string, unknown>;
            Object.entries(doc).forEach(([docKey, docValue]) => {
                if (docValue === undefined || docValue === null) return;
                if (docKey === "name" && docValue instanceof File) {
                    formData.append("document[file]", docValue);
                } else {
                    formData.append(`document[${docKey}]`, String(docValue));
                }
            });
        }

        const response = supplierData.id
            ? await api.put(`/supplier/${supplierData.id}`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              })
            : await api.post(`/supplier`, formData, {
                  headers: { "Content-Type": "multipart/form-data" },
              });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function addContactsToSupplier(
    supplierId: string | number | undefined,
    selectedContacts: IContactSchema[],
): Promise<void> {
    try {
        const response = await api.post(`/add-contacts`, {
            supplier_id: supplierId,
            contacts: selectedContacts,
        });
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

export async function fetchSupplierContacts(
    id: string,
): Promise<IContactCreateSchema[]> {
    try {
        const response = await api.get(`/supplier-contacts/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchSupplierById(
    id: string,
): Promise<ISupplierFormSchema> {
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
