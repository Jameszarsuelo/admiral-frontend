import z from "zod"
import { UserListSchema } from "./UserFormSchema";

export const IPCSchema = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    ipc_status_id: z.number(),
    created_at: z.number().optional().nullable(),
    updated_at: z.number().optional().nullable(),
    deleted_at: z.number().optional().nullable(),
    user: UserListSchema,
});

export const IPCFormSchema = z.object({
    id: z.number().optional(),
    salutation: z.string().nonempty("Salutation is required"),
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    email: z.email().nonempty("Invalid email address"),
    phone: z.string().nonempty("Phone is required"),
    mobile: z
        .string()
        .nonempty("Mobile number is required")
        .regex(
            /^\+?\d+$/,
            "Mobile number must contain only numbers and an optional + at the start",
        ),
    address1: z.string().nonempty("Address line 1 is required"),
    address2: z.string().optional(),
    address3: z.string().optional(),
    city: z.string().nonempty("City is required"),
    county: z.string().nonempty("County is required"),
    country: z.string().nonempty("Country is required"),
    postcode: z.string().nonempty("Postcode is required"),
});