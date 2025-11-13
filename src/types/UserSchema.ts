import { z } from "zod";
import { ContactBaseSchema, ContactCreateSchema } from "./ContactSchema";

export const NonEmptyString = z.string().min(1);
export const OptionalString = z.string().trim().min(1).optional();
export const NullableString = z.string().trim().min(1).nullable();
export const EmailString = z.string().email();

export const UserTypeSchema = z.object({
    id: z.number().int().positive(),
    type: z.string().min(1),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export const UserBaseSchema = z.object({
    id: z.number().int().positive(),
    contact_id: z.number().int().positive(),
    email: EmailString,
    user_profile_id: z.number().int().positive().nullable().optional(),
    user_type_id: z.number().int().positive().nullable().optional(),
    is_active: z.boolean().default(true),
    two_fa_enabled: z.boolean().default(false),
    two_fa_type: z.boolean().nullable().optional(), // from nullable boolean with default false
    sso_provider: z.string().nullable().optional(),
    sso_sub: z.string().nullable().optional(),
    email_verified_at: z.string().datetime().nullable().optional(),
    password: z.string().min(8),
    remember_token: z.string().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
    contact: ContactBaseSchema.optional(),
    user_type: UserTypeSchema.optional(),
});

export const UserCreateSchema = z.object({
    id: z.number().int().optional(),
    contact_id: z.number().int().optional(),
    email: EmailString,
    user_profile_id: z.number().int().positive().optional(),
    user_type_id: z.number().int().positive().optional(),
    is_active: z.boolean().optional(), // backend default true
    two_fa_enabled: z.boolean().optional(),
    two_fa_type: z.number().optional(),
    sso_provider: z.string().optional(),
    sso_sub: z.string().optional(),
    contact: ContactCreateSchema.omit({
        email: true,
        type: true,
        supplier_id: true,
    }).optional(),
});

export type IUserBase = z.infer<typeof UserBaseSchema>;
export type IUserCreate = z.infer<typeof UserCreateSchema>;
