import { AxiosError } from "axios";
import api from "./api";
import { IProfileBase, IProfileForm, IUserProfile } from "@/types/ProfileSchema";

export async function fetchProfileList(): Promise<IProfileBase[]> {
  try {
    const res = await api.get("/profiles");
    return res.data as IProfileBase[];
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function fetchProfileById(id: number | string): Promise<IProfileBase> {
  try {
    const res = await api.get(`/profiles/${id}`);
    return res.data as IProfileBase;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function upsertProfile(payload: IProfileForm): Promise<IProfileBase> {
  try {
    const res = payload.id ? await api.put(`/profiles/${payload.id}`, payload) : await api.post(`/profiles`, payload);
    return res.data as IProfileBase;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function deleteProfile(id: number | string): Promise<void> {
  try {
    const res = await api.delete(`/profiles/${id}`);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function fetchProfileOptions(): Promise<{ label: string; value: number }[]> {
  try {
    const res = await api.get("/role-options");
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data) {
      throw error.response.data;
    }
    throw error;
  }
}

export async function fetchViewMember(id: number | string): Promise<IUserProfile[]> {
     try {
      const res = await api.get(`/view-members/${id}`);
      return res.data;
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data) {
        throw error.response.data;
      }
      throw error;
    }
}

export default { fetchProfileList, fetchProfileById, upsertProfile, deleteProfile, fetchProfileOptions };
