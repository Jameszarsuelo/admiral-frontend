import api from "./api";
import { AxiosError } from "axios";
import {IBordereauStatuses, IOutcomeDelete, IOutcomeForm } from "../types/OutcomeSchema"


export async function fetchOutcomeList(): Promise<IOutcomeForm[]> {
    try {
        const response = await api.get(`/outcome`);
        console.log(response);
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
    try {
        const response = await api.get(`/outcome/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function fetchShowOutcome(id: string): Promise<IOutcomeForm> {
    try {
        const response = await api.get(`/outcome-show/${id}`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}



// export async function deleteOutcome(id: number){
//     try {
//         await api.delete(`/outcome/${id}`);
//     } catch (error) {
//         if (error instanceof AxiosError && error.response?.data) {
//             throw error.response.data;
//         }
//         throw error;
//     }
// }

export async function deleteOutcome(deleteData: IOutcomeDelete){
    try {
        // await api.delete(`/outcome/${id}`);
        await api.post(`/delete-outcome`, deleteData);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function bordereauStatuses(): Promise<IBordereauStatuses[]> {
    try {
        const response = await api.get(`/bordereau-statuses`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
