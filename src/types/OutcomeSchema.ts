import z from "zod"

export const OutcomeSchema = z.object({
    id: z.number().optional(),
    // status: z.union([z.boolean(), z.number().int().refine(val => val === 0 || val === 1)]).optional(),
    status: z.string(),
    outcome_code: z.string().nonempty("Outcome Code is required"),
    classification: z.string().nonempty("Classification is required"),
    queue: z.string().nonempty("Queue is required"),
    description: z.string().nonempty("Description is required"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export const OutComeDelete = z.object({
    id: z.number().optional(),
    // deleted_reason: z.number(),
    deleted_reason: z.string().nonempty("Reason is required"),
    deleted_description:  z.string().nonempty("Description is required"),
})

export const BordereauStatusSchema = z.object({
    value: z.number(),
    label: z.string()
});

export type IOutcomeForm = z.infer<typeof OutcomeSchema>
export type IOutcomeHeaders = z.infer<typeof OutcomeSchema>
export type IOutcomeDelete = z.infer<typeof OutComeDelete>
export type IBordereauStatuses = z.infer<typeof BordereauStatusSchema>