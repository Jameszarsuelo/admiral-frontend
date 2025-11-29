import z from "zod"

export const PlanningFormSchema = z.object({
    id: z.number().optional(),
    start_time: z.string().nonempty("Start time is required"),
    end_time: z.string().nonempty("End time is required"),
    work_saturday: z.enum(["0", "1"]),
    work_sunday: z.enum(["0", "1"]),
    forecast_horizon: z.string().nonempty("Forecast Horizon is required"),
    // is_active: z.boolean().optional(),
    is_active: z.union([z.boolean(), z.number().int().refine(val => val === 0 || val === 1)]).optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

export type IPlanningForm = z.infer<typeof PlanningFormSchema>
export type IPlanningHeaders = z.infer<typeof PlanningFormSchema>
