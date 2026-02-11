import z from "zod";

export const DepartmentSchema = z.object({
    id: z.number().optional(),
    department: z.string().nonempty("Department is required!"),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IDepartmentForm = z.infer<typeof DepartmentSchema>;
