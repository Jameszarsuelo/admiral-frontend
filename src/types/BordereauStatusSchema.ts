import z from "zod";

export const BordereauStatusBaseSchema = z.object({
    id: z.number().int().optional(),
    status: z.string().min(1, "Status is required"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IBordereauStatus = z.infer<typeof BordereauStatusBaseSchema>;