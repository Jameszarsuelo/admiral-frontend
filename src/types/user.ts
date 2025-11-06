import type z from "zod";
import type { UserFormSchema, UserListSchema } from "@/schema/UserFormSchema";

// export interface IUser {
//     id?: number;
    // salutation: string,
//     firstname: string,
//     lastname: string,
//     email: string,
//     phone: string,
//     mobile: string,
//     two_fa_enabled: boolean,
//     two_fa_type: number,
//     user_type_id?: string,
//     address1: string,
//     address2?: string,
//     address3?: string,
//     city: string,
//     county: string,
//     country: string,
//     postcode: string,
// }

export interface UserResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    user_profile_id: number;
    user_type_id: number;
    is_active: number;
    two_fa_enabled: number;
    two_fa_type: number;
    sso_provider: string | null;
    sso_sub: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export type IUserForm = z.infer<typeof UserFormSchema>
export type IUserList = z.infer<typeof UserListSchema>