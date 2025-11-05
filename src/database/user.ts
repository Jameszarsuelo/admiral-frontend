import { IUserForm } from "@/types/user";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertUser(userData: IUserForm): Promise<IUserForm> {
    try {
        const response = userData.id ?
            await api.put(`/user/${userData.id}`, userData) : await api.post(`/user`, userData);
        return response.data;
    } catch (error) {
        // Extract validation errors from axios error response
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function fetchUser(id: string): Promise<IUserForm> {
    return {
        id: 3,
        salutation: "Mr.",
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        phone: "0208123456",
        mobile: "+639178001234",
        twoFactor: true,
        twofaType: "1",
        user_type_id: "2", // Admin or Supervisor (string because schema uses z.string())
        address1: "123 Main Street",
        address2: "Unit 4B",
        address3: "",
        city: "London",
        county: "Greater London",
        country: "United Kingdom",
        postcode: "SW1A 1AA"
    };
}