import api from "./api";
import { AxiosError } from "axios";
import type {
    IBpcSupplierSkillRow,
    IBpcSupplierSkillUpsert,
} from "@/types/BpcSupplierSkillSchema";

export async function fetchMyBpcSupplierSkills(): Promise<IBpcSupplierSkillRow[]> {
    return fetchBpcSupplierSkills();
}

export async function fetchBpcSupplierSkills(bpcId?: number): Promise<IBpcSupplierSkillRow[]> {
    try {
        const response = await api.get(`/bpc/supplier-skills`, {
            params: bpcId ? { bpc_id: bpcId } : undefined,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertMyBpcSupplierSkills(
    payload: IBpcSupplierSkillUpsert,
): Promise<{ message: string }> {
    return upsertBpcSupplierSkills(payload);
}

export async function upsertBpcSupplierSkills(
    payload: { skills: { supplier_id: number; skill: number }[] },
    bpcId?: number,
) {
    try {
        const response = await api.put(`/bpc/supplier-skills`, payload, {
            params: bpcId ? { bpc_id: bpcId } : undefined,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
