import { z } from "zod";

export const WorkTypeSchema = z.object({
    id: z.number().int().optional(),
    type: z.string().min(1, "Type is required"),

    overall_value_field: z.enum([
        "total_payment_amount",
        "amount_banked",
        "value",
    ]),

    supplier_name: z.coerce.boolean().optional(),
    bordereau: z.coerce.boolean().optional(),
    comments: z.coerce.boolean().optional(),
    claim_number: z.coerce.boolean().optional(),
    name: z.coerce.boolean().optional(),
    supplier_ref: z.coerce.boolean().optional(),
    registration_number: z.coerce.boolean().optional(),
    invoice_date: z.coerce.boolean().optional(),
    lot_no: z.coerce.boolean().optional(),
    invoice_number: z.coerce.boolean().optional(),
    branch_name: z.coerce.boolean().optional(),
    out_of_hours: z.coerce.boolean().optional(),
    ph_name: z.coerce.boolean().optional(),
    tp_name: z.coerce.boolean().optional(),
    customer_name: z.coerce.boolean().optional(),
    payment_code_job_type: z.coerce.boolean().optional(),
    total_payment_amount: z.coerce.boolean().optional(),
    copart_comments: z.coerce.boolean().optional(),
    location: z.coerce.boolean().optional(),
    abi_group: z.coerce.boolean().optional(),
    search_date: z.coerce.boolean().optional(),
    repair_excess: z.coerce.boolean().optional(),
    replace_excess: z.coerce.boolean().optional(),
    incident_start: z.coerce.boolean().optional(),
    incident_date: z.coerce.boolean().optional(),
    hire_start_date: z.coerce.boolean().optional(),
    hire_end_date: z.coerce.boolean().optional(),
    daily_rate: z.coerce.boolean().optional(),
    hire_daily_rate: z.coerce.boolean().optional(),
    number_of_days_in_hire: z.coerce.boolean().optional(),
    qty_days_in_hire: z.coerce.boolean().optional(),
    group_rate: z.coerce.boolean().optional(),
    group_hire_rate: z.coerce.boolean().optional(),
    admiral_invoice_type: z.coerce.boolean().optional(),
    amount_banked: z.coerce.boolean().optional(),
    task_type: z.coerce.boolean().optional(),
    rejection_reasons: z.coerce.boolean().optional(),
    additional_information: z.coerce.boolean().optional(),
    make_and_model: z.coerce.boolean().optional(),
    postcode: z.coerce.boolean().optional(),
    date: z.coerce.boolean().optional(),
    cat: z.coerce.boolean().optional(),
    value: z.coerce.boolean().optional(),

    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type WorkTypeFormInput = z.input<typeof WorkTypeSchema>;
export type WorkTypeFormOutput = z.output<typeof WorkTypeSchema>;
export type IWorkTypeForm = WorkTypeFormOutput;
