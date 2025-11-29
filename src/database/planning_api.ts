import api from "./api";
import { AxiosError } from "axios";
import { IPlanningForm } from "@/types/PlanningSchema";


export async function fetchPlanningList(): Promise<IPlanningForm[]> {
    try {
        const response = await api.get(`/planning`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertPlanning(
    planningData: IPlanningForm,
): Promise<IPlanningForm> {
    console.log(planningData);
    try {
        const response = planningData.id
            ? await api.put(`/planning/${planningData.id}`, planningData)
            : await api.post(`/planning`, planningData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchPlanning(id: string): Promise<IPlanningForm> {
    try {
        const response = await api.get(`/planning/${id}`);
        // console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deletePlanning(id: number): Promise<void> {
    try {
        await api.delete(`/planning/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function getActivePlanning(): Promise<IPlanningForm> {
    try {
        const response = await api.get(`/planning-active`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}



