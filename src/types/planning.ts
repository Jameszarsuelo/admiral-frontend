import type z from "zod";
import { PlanningFormSchema } from "@/schema/PlanningFormSchema";


export type IPlanningForm = z.infer<typeof PlanningFormSchema>