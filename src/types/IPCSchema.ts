import { z } from "zod";
import { UserCreateSchema } from "./UserSchema";
import { ContactCreateSchema } from "./ContactSchema";

const NonEmptyString = z.string().min(1);
// const TimeString = z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Invalid time (HH:MM or HH:MM:SS)");

export const IPCStatusBaseSchema = z.object({
    id: z.number().int().positive(),
    status: NonEmptyString,
    wfm: z.boolean(),
});

export const IPCStatusCreateSchema = z.object({
    status: NonEmptyString,
    wfm: z.boolean(),
});

export const IPCStatusUpdateSchema = IPCStatusCreateSchema.partial().extend({
    id: z.number().int().positive(),
});

export const IPCBaseSchema = z.object({
    id: z.number().int().positive(),
    user_id: z.number().int().positive(),
    ipc_status_id: z.number().int().positive(),
    contact: ContactCreateSchema.omit({
        supplier_id: true,
        type: true,
    }),
});

export const IPCCreateSchema = UserCreateSchema.omit({
    contact_id: true,
    email: true,
    user_profile_id: true,
    user_type_id: true,
    is_active: true,
    sso_provider: true,
    sso_sub: true,
}).extend({
    id: z.number().int().optional(),
    user_id: z.number().int().optional(),
    contact: ContactCreateSchema.omit({
        supplier_id: true,
        type: true,
    }).optional(),
});

export type IIPCSchema = z.infer<typeof IPCBaseSchema>;
export type IIPCForm = z.infer<typeof IPCCreateSchema>;

// export const IPCSupplierStatBaseSchema = z.object({
//   id: z.number().int().positive(),
//   supplier_id: z.number().int().positive(),
//   invoice_id: z.number().int().positive(),
//   ipc_id: z.number().int().positive(),
//   sbr_by_supplier: z.number().int().nonnegative().default(0),
//   invoices_allocated_by_supplier: z.boolean().default(false),
//   invoices_presented_by_supplier: z.boolean().default(false),
//   invoices_paid_by_supplier: z.boolean().default(false),
//   invoices_query_by_supplier: z.boolean().default(false),
//   invoices_ratio_by_supplier: z.boolean().default(false),
//   archived_by: z.number().int().positive().nullable().optional(),
//   archived_date: z.string().datetime().nullable().optional(),
//   created_by: z.number().int().positive().nullable().optional(),
//   updated_by: z.number().int().positive().nullable().optional(),
//   created_at: z.string().datetime(),
//   updated_at: z.string().datetime(),
// });

// export const IPCSupplierStatCreateSchema = z.object({
//   supplier_id: z.number().int().positive(),
//   invoice_id: z.number().int().positive(),
//   ipc_id: z.number().int().positive(),
//   sbr_by_supplier: z.number().int().nonnegative().optional(),
//   invoices_allocated_by_supplier: z.boolean().optional(),
//   invoices_presented_by_supplier: z.boolean().optional(),
//   invoices_paid_by_supplier: z.boolean().optional(),
//   invoices_query_by_supplier: z.boolean().optional(),
//   invoices_ratio_by_supplier: z.boolean().optional(),
//   archived_by: z.number().int().positive().optional(),
//   archived_date: z.string().datetime().optional(),
//   created_by: z.number().int().positive().optional(),
//   updated_by: z.number().int().positive().optional(),
// });

// export const IPCSupplierStatUpdateSchema = IPCSupplierStatCreateSchema.partial().extend({
//   id: z.number().int().positive(),
// });

// export const IPCHandleTimeBaseSchema = z.object({
//   id: z.number().int().positive(),
//   ipc_id: z.number().int().positive(),
//   supplier_id: z.number().int().positive(),
//   invoice_id: z.number().int().positive(),
//   handle_time_by_supplier: TimeString.nullable().optional(),
//   created_by: z.number().int().positive().nullable().optional(),
//   updated_by: z.number().int().positive().nullable().optional(),
//   archive_by: z.number().int().positive().nullable().optional(), // follows migration name
//   created_at: z.string().datetime(),
//   updated_at: z.string().datetime(),
//   deleted_at: z.string().datetime().nullable().optional(),
// });

// export const IPCHandleTimeCreateSchema = z.object({
//   ipc_id: z.number().int().positive(),
//   supplier_id: z.number().int().positive(),
//   invoice_id: z.number().int().positive(),
//   handle_time_by_supplier: TimeString.optional(),
//   created_by: z.number().int().positive().optional(),
//   updated_by: z.number().int().positive().optional(),
//   archive_by: z.number().int().positive().optional(),
// });

// export const IPCHandleTimeUpdateSchema = IPCHandleTimeCreateSchema.partial().extend({
//   id: z.number().int().positive(),
// });
