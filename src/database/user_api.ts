import { IUserForm, IUserList } from "@/types/user";
import api from "./api";
import { AxiosError } from "axios";

export async function upsertUser(userData: IUserForm): Promise<IUserForm> {
    try {
        const response = userData.id ?
            await api.put(`/users/${userData.id}`, userData) : await api.post(`/users`, userData);
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
    try {
        const response = await api.get(`/users/${id}`);
        console.log(response);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}

export async function fetchUserList(): Promise<IUserList[]> {
    // return [{
    //     "id": 7,
    //     "firstname": "James",
    //     "lastname": "Zarsuelo",
    //     "email": "james.zarsuelo@indigo21.com",
    //     "user_profile_id": 6,
    //     "user_type_id": 1,
    //     "is_active": 1,
    //     "two_fa_enabled": false,
    //     "two_fa_type": 0,
    //     "sso_provider": null,
    //     "sso_sub": null,
    //     "email_verified_at": null,
    //     "created_at": "2025-11-04T11:19:48.000000Z",
    //     "updated_at": "2025-11-04T11:19:48.000000Z",
    //     "user_info": {
    //         "id": 3,
    //         "user_id": 7,
    //         "salutation": "mr",
    //         "phone": null,
    //         "mobile": "+44918239812",
    //         "address_line_1": null,
    //         "address_line_2": null,
    //         "address_line_3": null,
    //         "city": "city",
    //         "county": "county",
    //         "country": "United Kingdom",
    //         "postcode": "postcode",
    //         "created_by": null,
    //         "updated_by": null,
    //         "deleted_by": null,
    //         "created_at": "2025-11-04T11:19:48.000000Z",
    //         "updated_at": "2025-11-04T11:19:48.000000Z",
    //         "deleted_at": null
    //     },
    //     "user_type": {
    //         "id": 3,
    //         "type": "Invoice Payment Clerk",
    //         "created_at": "2025-11-03T23:04:38.000000Z",
    //         "updated_at": "2025-11-03T23:04:38.000000Z",
    //         "deleted_at": null
    //     },
    //     "user_profile": {
    //         "id": 6,
    //         "name": "Invoice Payment Clerk",
    //         "created_at": "2025-11-03T23:04:38.000000Z",
    //         "updated_at": "2025-11-03T23:04:38.000000Z",
    //         "deleted_at": null
    //     }
    // },
    // {
    //     "id": 2,
    //     "firstname": "James",
    //     "lastname": "Zarsuelo",
    //     "email": "james.zarsuelo@indigo21.com",
    //     "user_profile_id": 6,
    //     "user_type_id": 1,
    //     "is_active": 1,
    //     "two_fa_enabled": false,
    //     "two_fa_type": 0,
    //     "sso_provider": null,
    //     "sso_sub": null,
    //     "email_verified_at": null,
    //     "created_at": "2025-11-04T11:19:48.000000Z",
    //     "updated_at": "2025-11-04T11:19:48.000000Z",
    //     "user_info": {
    //         "id": 3,
    //         "user_id": 7,
    //         "salutation": "ms",
    //         "phone": null,
    //         "mobile": "+44918239812",
    //         "address_line_1": null,
    //         "address_line_2": null,
    //         "address_line_3": null,
    //         "city": "city",
    //         "county": "county",
    //         "country": "United Kingdom",
    //         "postcode": "postcode",
    //         "created_by": null,
    //         "updated_by": null,
    //         "deleted_by": null,
    //         "created_at": "2025-11-04T11:19:48.000000Z",
    //         "updated_at": "2025-11-04T11:19:48.000000Z",
    //         "deleted_at": null
    //     },
    //     "user_type": {
    //         "id": 3,
    //         "type": "Invoice Payment Clerk",
    //         "created_at": "2025-11-03T23:04:38.000000Z",
    //         "updated_at": "2025-11-03T23:04:38.000000Z",
    //         "deleted_at": null
    //     },
    //     "user_profile": {
    //         "id": 6,
    //         "name": "Invoice Payment Clerk",
    //         "created_at": "2025-11-03T23:04:38.000000Z",
    //         "updated_at": "2025-11-03T23:04:38.000000Z",
    //         "deleted_at": null
    //     }
    // }
    // ]
    try {
        const response = await api.get(`/users`);
        return response.data;
    } catch (error) {
       if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}


export async function deleteUser(id: number): Promise<void> {
    try {
        await api.delete(`/users/${id}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            throw error.response.data;
        }
        throw error;
    }
}
