import api from "./api";
import { AxiosError } from "axios";
import { IReasonForm } from "@/types/ReasonSchema";

export async function fetchReasonList(): Promise<IReasonForm[]>{
    try {
       const response = await api.get("/reason");
       return response.data; 
    } catch (error) {
        if(error instanceof AxiosError && error.response?.data){
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchReasonOptions(){
    const data = await fetchReasonList();
    const result: { value: number; label: string }[] = [];
    data.forEach((item)=>{
        if(item.reason_for === "3" && item.id !== undefined){
            result.push({
                        value: item.id!,
                        label: item.reason
                    })
        }
    })
    return result;
}

export async function fetchReason(id: string): Promise<IReasonForm> {
    try {
        const response = await api.get(`/reason/${id}`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function upsertReason(reasonData: IReasonForm): Promise<IReasonForm> {
    try {
        const response = reasonData.id
            ? await api.put(`/reason/${reasonData.id}`, reasonData)
            : await api.post(`/reason`, reasonData);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function deleteReason(id: number){
    try {
        await api.delete(`/reason/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}