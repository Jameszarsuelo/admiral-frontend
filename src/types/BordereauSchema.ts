import { z } from "zod";
import { SupplierBaseSchema } from "./SupplierSchema";
import { BPCBaseSchema } from "./BPCSchema";

// // InvoiceInfos
export const InvoiceInfoSchema = z.object({
    id: z.number(),
    invoice_id: z.number(),
    description: z.string().nullable(),
    ooh_instructions: z.string().nullable(),
    expected_processing_date: z.string().nullable(), // ISO date string
    amount_due_total: z.number(),
    amount_due_cost: z.number(),
    amount_due_vat: z.number(),
    amount_currency: z.string(),
    claim_number: z.string().min(1, "Claim Number is required"),
    claimant_registration: z.string().min(1, "Claimant Registration is required"),
    claimant_name: z.string().min(1, "Claimant Name is required"),
    invoice_paid: z.boolean(),
    invoice_paid_date: z.string().nullable(), // ISO date string
    invoice_closed: z.boolean(),
    time_to_pay_elapsed: z.string(), // ISO date string
    time_to_process_elapsed: z.string(), // time string
    number_of_queries: z.number(),
});

export const InvoiceStatusSchema = z.object({
    id: z.number(),
    status: z.string(),
});

// Invoices
export const InvoiceBaseSchema = z.object({
    id: z.number().int().optional(),
    invoice_status_id: z.number(),
    invoice_number: z.string(),
    supplier_reference: z.string().nullable(),
    invoice_type: z.string(),
    batch_number: z.number(),
    invoice_outcome_id: z.number().nullable(),
    deadline_payment_date: z.string(), // ISO date string
    target_payment_date: z.string(), // ISO date string
    due_date: z.string(), // ISO date string
    created_by: z.number().nullable(),
    updated_by: z.number().nullable(),
    closed_date: z.string().nullable(), // ISO date string
    closed_by: z.number().nullable(),
    created_at: z.string(), // ISO date string
    updated_at: z.string(), // ISO date string
    deleted_at: z.string().nullable(), // ISO date string
    supplier: SupplierBaseSchema,
    invoice_info: InvoiceInfoSchema,
    invoice_status: InvoiceStatusSchema,
    ipc: BPCBaseSchema.optional(),
});

export const InvoiceCreateSchema = z.object({
    id: z.number().int().optional(),
    ipc_id: z.number().optional(),
    supplier_id: z.number().int().min(1, "Supplier is required"),
    invoice_number: z.string().min(1, "Invoice Number is required"),
    supplier_reference: z.string().min(1, "Supplier Reference is required"),
    invoice_type: z.string().min(1, "Invoice Type is required"),
    // invoice_outcome_id: z.number().nullable(),
    // deadline_payment_date: z.string(), // ISO date string
    // target_payment_date: z.string(), // ISO date string
    // due_date: z.string(), // ISO date string
    invoice_info: InvoiceInfoSchema.omit({
        id: true,
        invoice_id: true,
        expected_processing_date: true,
        invoice_paid: true,
        invoice_paid_date: true,
        invoice_closed: true,
        time_to_pay_elapsed: true,
        time_to_process_elapsed: true,
        number_of_queries: true,
    }),
});

export type IInvoiceSchema = z.infer<typeof InvoiceBaseSchema>;
export type IInvoiceCreateSchema = z.infer<typeof InvoiceCreateSchema>;
