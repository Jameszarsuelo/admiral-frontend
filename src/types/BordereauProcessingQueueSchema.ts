import z from "zod";

export const BordereauProcessingQueueBaseSchema = z.object({
    id: z.number().int().optional(),
    deadline_queue_top: z.number().int().min(0),
    target_queue_top: z.number().int().min(0),
    queue_priority_multiplier: z.number().int().min(0),
    queue_enforce_supplier_priority: z.boolean(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().nullable().optional(),
});

export const BordereauProcessingQueueFormSchema =
    BordereauProcessingQueueBaseSchema.omit({
        created_at: true,
        updated_at: true,
        deleted_at: true,
    });

export type IBordereauProcessingQueueBase = z.infer<
    typeof BordereauProcessingQueueBaseSchema
>;
export type IBordereauProcessingQueueForm = z.infer<
    typeof BordereauProcessingQueueFormSchema
>;
