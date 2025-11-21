import { z } from "zod";

export const NonEmptyString = z.string().min(1);
export const OptionalString = z.string().trim().min(1).optional();
export const NullableString = z.string().trim().min(1).nullable();
export const EmailString = z.string().email();

export const ContactBaseSchema = z.object({
    id: z.number().int().positive(),
    salutation: z.string().nullable().optional(),
    firstname: NonEmptyString,
    lastname: NonEmptyString,
    phone: z.string().nullable().optional(),
    mobile: z.string().nullable().optional(),
    email: EmailString,
    organisation: z.string().nullable().optional(),
    address_line_1: z.string().nullable().optional(),
    address_line_2: z.string().nullable().optional(),
    address_line_3: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    county: z.string().nullable().optional(),
    country: z.string().default("United Kingdom"),
    postcode: z.string().nullable().optional(),
    type: z.string().refine((val) => ["1", "2", "3"].includes(val), {
        message: "Type must be '1', '2', or '3'",
    }),
    created_by: z.number().int().positive().nullable().optional(),
    updated_by: z.number().int().positive().nullable().optional(),
    deleted_by: z.number().int().positive().nullable().optional(),
    created_at: z.string().datetime(),
    updated_at: z.string().datetime(),
    deleted_at: z.string().datetime().nullable().optional(),
});

export const ContactCreateSchema = z.object({
    id: z.number().int().positive().optional(),
    salutation: z.string().optional(),
    firstname: NonEmptyString,
    lastname: NonEmptyString,
    phone: z.string().optional(),
    mobile: z.string().optional(),
    email: EmailString,
    organisation: z.string().optional(),
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    address_line_3: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    country: z.string().default("United Kingdom").optional(),
    postcode: z.string().optional(),
    supplier_id: z.number().int().positive().nullable().optional(),
    type: z.string().refine((val) => ["1", "2", "3"].includes(val), {
        message: "Type must be '1', '2', or '3'",
    }),
    created_by: z.number().int().positive().nullable().optional(),
    updated_by: z.number().int().positive().nullable().optional(),
    deleted_by: z.number().int().positive().nullable().optional(),
});

// export const ContactUpdateSchema = ContactCreateSchema.partial().extend({
//   id: z.number().int().positive(),
// });

export type IContactSchema = z.infer<typeof ContactBaseSchema>;
export type IContactCreateSchema = z.infer<typeof ContactCreateSchema>;
// export type IContactUpdateSchema = z.infer<typeof ContactUpdateSchema>;
