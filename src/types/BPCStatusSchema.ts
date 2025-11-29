import z from "zod";

export const BPCStatusBaseSchema = z.object({
    id: z.number().int().optional(),
    status: z.string().min(1, "Status is required"),
    wfm: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IBPCStatus = z.infer<typeof BPCStatusBaseSchema>;