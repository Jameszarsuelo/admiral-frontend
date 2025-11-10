import z from "zod"

export const PlanningFormSchema = z.object({
    id: z.number().optional(),
    start_time: z.string().nonempty("Start time is required"),
    end_time: z.string().nonempty("End time is required"),
    work_saturday: z.string(),
    work_sunday: z.string(),
    forecast_horizon: z.string().nonempty("Forecast Horizon is required"),
    created_at: z.number().optional(),
    updated_at: z.number().optional(),
});

export type IPlanningForm = z.infer<typeof PlanningFormSchema>
