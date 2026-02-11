import z from "zod";

export const BordereauTypeSchema = z.object({
    id: z.number().optional(),
    bordereau_type: z.string().nonempty("Bordereau type is required!"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IBordereauTypeForm = z.infer<typeof BordereauTypeSchema>;
