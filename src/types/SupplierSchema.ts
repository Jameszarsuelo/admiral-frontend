import { z } from "zod";
import { UserCreateSchema } from "./UserSchema";
import { DocumentCreateSchema } from "./DocumentSchema";
import { ContactBaseSchema } from "./ContactSchema";

export const CountryEnum = z.enum(["United Kingdom"]); // From defaults; expand if more are allowed later
export const ContactTypeEnum = z.enum(["1", "2", "3"]).transform(Number);

export const NonEmptyString = z.string().min(1);
export const OptionalString = z.string().trim().min(1).optional();
export const NullableString = z.string().trim().min(1).nullable();
export const EmailString = z.string().email();

export const SupplierBaseSchema = z.object({
    id: z.number().int().positive(),
    user_id: z.number().int().optional(),
    name: NonEmptyString,
    vat_number: z.string().nullable().optional(),
    address_line_1: z.string().nullable().optional(),
    address_line_2: z.string().nullable().optional(),
    address_line_3: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    county: z.string().nullable().optional(),
    country: z.string().default("United Kingdom"),
    postcode: z.string().nullable().optional(),
    phone: z.string().nullable().optional(),
    invoice_query_email: EmailString.nullable().optional(),
    contact_id: z.number().int().optional(),
    max_payment_days: z.number().int().nonnegative().default(30),
    target_payment_days: z.number().int().nonnegative().default(7),
    preferred_payment_day: z.string().nullable().optional(),
    priority: z.number().int().default(5),
    contact: ContactBaseSchema.optional(),
});

export const SupplierFormSchema = UserCreateSchema.omit({
    contact_id: true,
    user_profile_id: true,
    user_type_id: true,
    is_active: true,
}).extend({
    id: z.number().int().optional(),
    name: NonEmptyString,
    address_line_1: z.string().optional(),
    address_line_2: z.string().optional(),
    address_line_3: z.string().optional(),
    city: z.string().optional(),
    county: z.string().optional(),
    country: z.string().optional(),
    postcode: z.string().optional(),
    phone: z.string().optional(),
    bordereau_query_email: EmailString.optional(),
    contact_id: z.number({ message: "Contact is required" }).int(),
    max_payment_days: z.number().int().nonnegative().optional(),
    target_payment_days: z.number().int().nonnegative().optional(),
    preferred_payment_day: z.string().optional(),
    priority: z.number().int().optional(),
    created_by: z.number().int().optional(),
    updated_by: z.number().int().optional(),
    document: DocumentCreateSchema.optional(),
});

export const SupplierUpdateSchema = SupplierFormSchema.partial().extend({
    id: z.number().int().positive(),
});

export type ISupplierSchema = z.infer<typeof SupplierBaseSchema>;
export type ISupplierFormSchema = z.infer<typeof SupplierFormSchema>;

// export const SupplierInfoBaseSchema = z.object({
//   id: z.number().int().positive(),
//   supplier_id: z.number().int().positive(),
//   received: z.boolean().default(false),
//   processed: z.boolean().default(false),
//   paid: z.boolean().default(false),
//   queried: z.boolean().default(false),
//   created_at: z.string().datetime(),
//   updated_at: z.string().datetime(),
//   deleted_at: z.string().datetime().nullable().optional(),
// });

// export const SupplierInfoCreateSchema = z.object({
//   supplier_id: z.number().int().positive(),
//   received: z.boolean().optional(),
//   processed: z.boolean().optional(),
//   paid: z.boolean().optional(),
//   queried: z.boolean().optional(),
// });

// export const SupplierInfoUpdateSchema = SupplierInfoCreateSchema.partial().extend({
//   id: z.number().int().positive(),
// });

// export const SupplierContractBaseSchema = z.object({
//   id: z.number().int().positive(),
//   supplier_id: z.number().int().positive(),
//   contract_payment_days: z.number().int().nonnegative(),
//   name: NonEmptyString,
//   reference: z.string().nullable().optional(),
//   start_date: z.string().date().nullable().optional(),   // ISO date (YYYY-MM-DD)
//   end_date: z.string().date(),
//   document_id: z.number().int().positive(),
//   created_by: z.number().int().positive().nullable().optional(),
//   updated_by: z.number().int().positive().nullable().optional(),
//   created_at: z.string().datetime(),
//   updated_at: z.string().datetime(),
//   deleted_at: z.string().datetime().nullable().optional(),
// });

// export const SupplierContractCreateSchema = z.object({
//   supplier_id: z.number().int().positive(),
//   contract_payment_days: z.number().int().nonnegative(),
//   name: NonEmptyString,
//   reference: z.string().optional(),
//   start_date: z.string().date().optional(),
//   end_date: z.string().date(),
//   document_id: z.number().int().positive(),
// });

// export const SupplierContractUpdateSchema = SupplierContractCreateSchema.partial().extend({
//   id: z.number().int().positive(),
// });
