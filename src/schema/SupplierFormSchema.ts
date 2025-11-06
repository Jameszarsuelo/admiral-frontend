import z from "zod";
import { UserFormSchema, UserListSchema } from "./UserFormSchema";

export const SupplierSchema = z.object({
    id: z.number().optional(),
    vat_number: z.string().nonempty("VAT number is required"),
    invoice_query_email: z
        .string()
        .email("Invalid email address")
        .nonempty("Invoice query email is required"),
    phone: z.string().optional(),
    max_payment_days: z
        .number()
        .min(0, "Max payment days cannot be negative")
        .optional(),
    target_payment_days: z
        .number()
        .min(0, "Target payment days cannot be negative")
        .optional(),
    preferred_payment_day: z.string().optional(),
    priority: z.number().min(1, "Priority must be at least 1").optional(),
    user: UserListSchema,
});

export const SupplierFormSchema = UserFormSchema.omit({
    created_by: true,
    updated_by: true,
    deleted_by: true,
    created_at: true,
    updated_at: true,
    deleted_at: true,
}).extend({
    vat_number: z.string().nonempty("VAT number is required"),
    invoice_query_email: z
        .string()
        .email("Invalid email address")
        .nonempty("Invoice query email is required"),
    phone: z.string().optional(),
    max_payment_days: z
        .number()
        .min(0, "Max payment days cannot be negative")
        .optional(),
    target_payment_days: z
        .number()
        .min(0, "Target payment days cannot be negative")
        .optional(),
    preferred_payment_day: z.string().optional(),
    priority: z.number().min(1, "Priority must be at least 1").optional(),
});
