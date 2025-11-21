import z from "zod";
import { ModuleBaseSchema } from "./ModuleSchema";

export const RoleModuleActionPivotSchema = z.object({
    role_id: z.number().int(),
    module_action_id: z.number().int(),
});

export const RoleModuleActionBaseSchema = z.object({
    id: z.number().int().optional(),
    module_id: z.number().int(),
    action: z.string().min(1, "Action is required"),
    code: z.string().min(1, "Code is required"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    pivot: RoleModuleActionPivotSchema.optional(),
    module: ModuleBaseSchema.optional(),
});

export const RoleModuleActionFormSchema = z.object({
    id: z.number().int().optional(),
    module_id: z.number().int(),
    action: z.string().min(1, "Action is required"),
    code: z.string().min(1, "Code is required"),
});

export const RoleBaseSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1, "Role name is required"),
    code: z.string().min(1, "Role code is required"),
    module_actions: z.array(RoleModuleActionBaseSchema).optional(),
    created_at: z.string(),
    updated_at: z.string(),
});

export const RoleFormSchema = z.object({
    id: z.number().int().optional(),
    name: z.string().min(1, "Role name is required"),
    code: z.string().min(1, "Role code is required"),
    module_actions: z.array(RoleModuleActionFormSchema).optional(),
});

export type IRoleBase = z.infer<typeof RoleBaseSchema>;
export type IRoleForm = z.infer<typeof RoleFormSchema>;
