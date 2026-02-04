import z from "zod";

export const BpcSupplierSkillRowSchema = z.object({
    id: z.number().int(),
    name: z.string(),
    skill: z.number().int().min(0).max(100),
});

export type IBpcSupplierSkillRow = z.infer<typeof BpcSupplierSkillRowSchema>;

export const BpcSupplierSkillUpsertSchema = z.object({
    skills: z.array(
        z.object({
            supplier_id: z.number().int(),
            skill: z.number().int().min(0).max(100),
        }),
    ),
});

export type IBpcSupplierSkillUpsert = z.infer<typeof BpcSupplierSkillUpsertSchema>;
