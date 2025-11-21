import z from "zod"

export const OutcomeSchema = z.object({
    id: z.number().optional(),
    status: z.union([z.boolean(), z.number().int().refine(val => val === 0 || val === 1)]).optional(),
    // status: z.boolean().optional(),
    outcome_code: z.string().nonempty("Outcome Code is required"),
    classification: z.string().nonempty("Classification is required"),
    queue: z.string().nonempty("Queue is required"),
    description: z.string().nonempty("Description is required"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IOutcomeForm = z.infer<typeof OutcomeSchema>
export type IOutcomeHeaders = z.infer<typeof OutcomeSchema>
