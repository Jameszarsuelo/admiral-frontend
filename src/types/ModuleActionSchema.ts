import z from "zod";
import { ModuleBaseSchema } from "./ModuleSchema";

export const ModuleActionBaseSchema = z.object({
    id: z.number().int().optional(),
    module_id: z.number().int(),
    action: z.string().min(1, "Module name is required"),
    code: z.string().min(1, "Module code is required"),
    created_at: z.string(),
    updated_at: z.string(),
    module: ModuleBaseSchema,
});

export const ModuleActionFormSchema = ModuleActionBaseSchema.omit({
    created_at: true,
    updated_at: true,
    module: true,
});

export type IModuleActionBase = z.infer<typeof ModuleActionBaseSchema>;
export type IModuleActionForm = z.infer<typeof ModuleActionFormSchema>;
