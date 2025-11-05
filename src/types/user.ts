import type z from "zod";
import type { UserFormSchema } from "@/schema/UserFormSchema";

export interface IUser {
    salutation: string,
    firstname: string,
    lastname: string,
    email: string,
    phone: string,
    mobile: string,
    twoFactor: boolean,
    twofaType: number,
    user_type_id: string,
    address1: string,
    address2?: string,
    address3?: string,
    city: string,
    county: string,
    country: string,
    postcode: string,
}

export type IUserForm = z.infer<typeof UserFormSchema>