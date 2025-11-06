import { IUserForm, IUserList } from "@/types/user";
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
    // return {
    //     id: 3,
    //     salutation: "Mr.",
    //     firstname: "John",
    //     lastname: "Doe",
    //     email: "john.doe@example.com",
    //     phone: "0208123456",
    //     mobile: "+639178001234",
    //     twoFactor: true,
    //     twofaType: "1",
    //     user_type_id: "2", // Admin or Supervisor (string because schema uses z.string())
    //     address1: "123 Main Street",
    //     address2: "Unit 4B",
    //     address3: "",
    //     city: "London",
    //     county: "Greater London",
    //     country: "United Kingdom",
    //     postcode: "SW1A 1AA"
    // };
    try {
        const response = await api.get(`/user/${id}`);
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
    return [{
        "id": 7,
        "firstname": "James",
        "lastname": "Zarsuelo",
        "email": "james.zarsuelo@indigo21.com",
        "user_profile_id": 6,
        "user_type_id": 1,
        "is_active": 1,
        "two_fa_enabled": false,
        "two_fa_type": 0,
        "sso_provider": null,
        "sso_sub": null,
        "email_verified_at": null,
        "created_at": "2025-11-04T11:19:48.000000Z",
        "updated_at": "2025-11-04T11:19:48.000000Z",
        "user_info": {
            "id": 3,
            "user_id": 7,
            "salutation": "mr",
            "phone": null,
            "mobile": "+44918239812",
            "address_line_1": null,
            "address_line_2": null,
            "address_line_3": null,
            "city": "city",
            "county": "county",
            "country": "United Kingdom",
            "postcode": "postcode",
            "created_by": null,
            "updated_by": null,
            "deleted_by": null,
            "created_at": "2025-11-04T11:19:48.000000Z",
            "updated_at": "2025-11-04T11:19:48.000000Z",
            "deleted_at": null
        },
        "user_type": {
            "id": 3,
            "type": "Invoice Payment Clerk",
            "created_at": "2025-11-03T23:04:38.000000Z",
            "updated_at": "2025-11-03T23:04:38.000000Z",
            "deleted_at": null
        },
        "user_profile": {
            "id": 6,
            "name": "Invoice Payment Clerk",
            "created_at": "2025-11-03T23:04:38.000000Z",
            "updated_at": "2025-11-03T23:04:38.000000Z",
            "deleted_at": null
        }
    },
    {
        "id": 2,
        "firstname": "James",
        "lastname": "Zarsuelo",
        "email": "james.zarsuelo@indigo21.com",
        "user_profile_id": 6,
        "user_type_id": 1,
        "is_active": 1,
        "two_fa_enabled": false,
        "two_fa_type": 0,
        "sso_provider": null,
        "sso_sub": null,
        "email_verified_at": null,
        "created_at": "2025-11-04T11:19:48.000000Z",
        "updated_at": "2025-11-04T11:19:48.000000Z",
        "user_info": {
            "id": 3,
            "user_id": 7,
            "salutation": "ms",
            "phone": null,
            "mobile": "+44918239812",
            "address_line_1": null,
            "address_line_2": null,
            "address_line_3": null,
            "city": "city",
            "county": "county",
            "country": "United Kingdom",
            "postcode": "postcode",
            "created_by": null,
            "updated_by": null,
            "deleted_by": null,
            "created_at": "2025-11-04T11:19:48.000000Z",
            "updated_at": "2025-11-04T11:19:48.000000Z",
            "deleted_at": null
        },
        "user_type": {
            "id": 3,
            "type": "Invoice Payment Clerk",
            "created_at": "2025-11-03T23:04:38.000000Z",
            "updated_at": "2025-11-03T23:04:38.000000Z",
            "deleted_at": null
        },
        "user_profile": {
            "id": 6,
            "name": "Invoice Payment Clerk",
            "created_at": "2025-11-03T23:04:38.000000Z",
            "updated_at": "2025-11-03T23:04:38.000000Z",
            "deleted_at": null
        }
    }
    ]
}