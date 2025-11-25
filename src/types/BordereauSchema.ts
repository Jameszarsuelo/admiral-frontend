import { z } from "zod";
// import { SupplierBaseSchema } from "./SupplierSchema";
import { BPCBaseSchema } from "./BPCSchema";

// Bordereau Validation
export const BordereauValidationBaseSchema = z.object({
    name: z.string().min(1, "Name is required"),
    salvage_banked: z.boolean().optional(),
    salvage_copart: z.boolean().optional(),
    repair: z.boolean().optional(),
    hire_car: z.boolean().optional(),
    legal: z.boolean().optional(),
    investigation: z.boolean().optional(),
    recovery: z.boolean().optional(),
});

export const BordereauCommentBaseSchema = z.object({
    id: z.number().int().optional(),
    bordereau_id: z.number().int().optional(),
    comment: z.string().min(1, "Comment is required"),
    created_by: z.string().optional(),
    created_at: z.string().optional(), // ISO timestamp
});

export const BordereauStatusBaseSchema = z.object({
    id: z.number().int().optional(),
    status: z.string().min(1, "Status is required"),
});

// Bordereau
export const BordereauBaseSchema = z.object({
    id: z.number().int().optional(),

    supplier_id: z.number().nullable(),
    bordereau_status_id: z.number().nullable(),
    bpc_id: z.number().nullable(),
    bordereau_outcome_id: z.number().nullable(),

    bordereau_file: z.string().nullable(),
    claim_number: z.string().nullable(),
    name: z.string().nullable(),
    supplier_ref: z.string().nullable(),
    registration_number: z.string().nullable(),
    invoice_date: z.string().nullable(), // ISO date
    lot_number: z.string().nullable(),
    invoice_number: z.string().nullable(),
    branch_name: z.string().nullable(),
    out_of_hours: z.string().nullable(),
    ph_name: z.string().nullable(),
    tp_name: z.string().nullable(),
    customer_name: z.string().nullable(),
    payment_code_job_type: z.string().nullable(),

    total_payment_amount: z.number().nullable(),

    copart_comments: z.string().nullable(),
    location: z.string().nullable(),
    abi_group: z.string().nullable(),
    search_date: z.string().nullable(), // ISO date

    repair_excess: z.number().nullable(),
    replace_excess: z.number().nullable(),

    incident_start: z.string().nullable(), // ISO date
    hire_start_date: z.string().nullable(), // ISO date
    hire_end_date: z.string().nullable(), // ISO date
    hire_daily_rate: z.number().nullable(),
    qty_days_in_hire: z.number().nullable(),

    admiral_invoice_type: z.number().int(),
    group_hire_rate: z.number().nullable(),
    amount_banked: z.number().nullable(),

    created_by: z.number().nullable(),
    updated_by: z.number().nullable(),
    closed_date: z.string().nullable(), // ISO timestamp/date
    closed_by: z.number().nullable(),

    due_date: z.string().nullable(), // ISO date
    deadline_payment_date: z.string().nullable(), // ISO date
    target_payment_date: z.string().nullable(), // ISO date

    upload_batch_number: z.number().nullable(),

    bordereau_success: z.boolean(),
    bordereau_success_date: z.string().nullable(), // ISO timestamp
    bordereau_closed: z.boolean(),

    time_to_success_elapsed: z.string().nullable(),
    time_to_process: z.string().nullable(), // HH:mm:ss
    query_iterations: z.number(),

    upload_created_by: z.number().nullable(),

    expected_processing_date: z.string().nullable(), // ISO date
    place_in_queue: z.number().nullable(),

    created_at: z.string(), // ISO timestamp
    updated_at: z.string(), // ISO timestamp
    deleted_at: z.string().nullable(), // ISO timestamp
});

export const BordereauFormSchema = BordereauBaseSchema.pick({
    id: true,
    supplier_id: true,
    claim_number: true,
    name: true,
    supplier_ref: true,
    registration_number: true,
    invoice_date: true,
    invoice_number: true,
    branch_name: true,
    out_of_hours: true,
    ph_name: true,
    tp_name: true,
    customer_name: true,
    payment_code_job_type: true,
    total_payment_amount: true,
    copart_comments: true,
    location: true,
    abi_group: true,
    repair_excess: true,
    replace_excess: true,
    incident_start: true,
    hire_start_date: true,
    hire_end_date: true,
    hire_daily_rate: true,
    qty_days_in_hire: true,
    group_hire_rate: true,
    admiral_invoice_type: true,
    amount_banked: true,
}).extend({
    comment: z.array(BordereauCommentBaseSchema).optional(),
});

export const BordereauIndexSchema = BordereauBaseSchema.pick({
    id: true,
    supplier_id: true,
    claim_number: true,
    name: true,
    supplier_ref: true,
    registration_number: true,
    invoice_date: true,
    invoice_number: true,
    branch_name: true,
    lot_number: true,
    search_date: true,
    out_of_hours: true,
    ph_name: true,
    tp_name: true,
    customer_name: true,
    target_payment_date: true,
    deadline_payment_date: true,
    payment_code_job_type: true,
    total_payment_amount: true,
    copart_comments: true,
    location: true,
    abi_group: true,
    repair_excess: true,
    upload_batch_number: true,
    bordereau_success: true,
    bordereau_closed: true,
    replace_excess: true,
    place_in_queue: true,
    incident_start: true,
    hire_start_date: true,
    hire_end_date: true,
    hire_daily_rate: true,
    qty_days_in_hire: true,
    group_hire_rate: true,
    query_iterations: true,
    time_to_success_elapsed: true,
    time_to_process: true,
    admiral_invoice_type: true,
    amount_banked: true,
    created_at: true,
    updated_at: true,
    created_by: true,
    updated_by: true,
    closed_by: true,
    closed_date: true,
}).extend({
    comments: BordereauCommentBaseSchema.array().optional(),
    // supplier: SupplierBaseSchema.optional(),
    bordereau_status: BordereauStatusBaseSchema,
    bpc: BPCBaseSchema.optional(),
});

export type IBordereauSchema = z.infer<typeof BordereauBaseSchema>;
export type IBordereauForm = z.infer<typeof BordereauFormSchema>;
export type IBordereauIndex = z.infer<typeof BordereauIndexSchema>;
export type IBordereauComment = z.infer<typeof BordereauCommentBaseSchema>;