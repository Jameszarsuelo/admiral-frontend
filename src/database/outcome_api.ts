import api from "./api";
import { AxiosError } from "axios";
import {IOutcomeForm } from "../types/OutcomeSchema"


export async function fetchOutcomeList(): Promise<IOutcomeForm[]> {

    // return [
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         },
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         },
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         },
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         },
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         },
    //         {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         }

    //             ];
    try {
        const response = await api.get(`/outcome`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function upsertOutcome(
    outcomeData: IOutcomeForm,
): Promise<IOutcomeForm> {
    console.log(outcomeData);
    try {
        const response = outcomeData.id
            ? await api.put(`/outcome/${outcomeData.id}`, outcomeData)
            : await api.post(`/outcome`, outcomeData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchOutcome(id: string): Promise<IOutcomeForm> {

    // return {
    //           id: 1,
    //           status: true,
    //           outcome_code: "OC-1001",
    //           classification: "Follow-up Required",
    //           queue: "Support Team",
    //           description: "Customer needs additional assistance regarding billing inquiry.",
    //           created_at: "2025-01-15 10:30:00",
    //           updated_at: "2025-01-15 10:45:00",
    //         };
    try {
        const response = await api.get(`/outcome/${id}`);
        // console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteOutcome(id: number){
    try {
        await api.delete(`/outcome/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}



