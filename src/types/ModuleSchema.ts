import z from "zod";

export const ModuleBaseSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1, "Module name is required"),
    code: z.string().min(1, "Module code is required"),
    path: z.string().min(1, "Module path is required"),
    parent_id: z.number().nullable(),
    order: z.number().int().optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const ModuleFormSchema = ModuleBaseSchema.omit({
    created_at: true,
    updated_at: true,
});

export type IModuleBase = z.infer<typeof ModuleBaseSchema>;
export type IModuleForm = z.infer<typeof ModuleFormSchema>;
