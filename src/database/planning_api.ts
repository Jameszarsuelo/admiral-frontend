import api from "./api";
import { AxiosError } from "axios";
import { IPlanningForm } from "@/types/PlanningSchema";

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
    // return {
    //     id: 1,
    //     start_time: "08:00", // string, required
    //     end_time: "17:00", // string, required
    //     work_saturday: "0", // boolean, required
    //     work_sunday: "1", // boolean, required
    //     forecast_horizon: "3 months", // string, required
    //     created_at: Date.now(), // number (timestamp)
    //     updated_at: Date.now(),
    // };
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


export async function fetchPlanningList(): Promise<IPlanningForm[]> {
    try {
        const response = await api.get(`/planning`);
        return response.data.id;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
