import z from "zod";

export const ReasonSchema = z.object({
    id: z.number().optional(),
    reason: z.string().nonempty("Reason is required!"),
    reason_for: z.enum(["1","2","3"]),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IReasonForm = z.infer<typeof ReasonSchema>
export type IReasonHeaders = z.infer<typeof ReasonSchema>