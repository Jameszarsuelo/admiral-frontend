import z from "zod"

export const OutcomeSchema = z.object({
    id: z.number().optional(),
    // status: z.union([z.boolean(), z.number().int().refine(val => val === 0 || val === 1)]).optional(),
    status: z.string(),
    // Outcome code (free text) - not required per spec
    outcome_code: z.string(),
    // Outcome Code Heading - dropdown: Successful, Redirect, Query, Unsuccessful
    outcome_code_heading: z.string().optional(),
    // Classification - optional free text
    classification: z.string().optional(),
    // Queue - keep required (Bordereau or Tasks)
    queue: z.string().nonempty("Queue is required"),
    // Platform action: optional string value
    platform_action: z.string().optional(),
    // Description - optional unless comment_mandatory === true
    description: z.string().optional(),
    // Comment mandatory: boolean (true means description required)
    comment_mandatory: z.boolean().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
});

// Ensure description is present when comment_mandatory === true
export const OutcomeSchemaWithConditional = OutcomeSchema.refine(
    (data) => {
        if (data.comment_mandatory === true) {
            return typeof data.description === "string" && data.description.trim() !== "";
        }
        return true;
    },
    {
        message: "Description is required when Comment Mandatory is enabled",
        path: ["description"],
    }
);

export const OutComeDelete = z.object({
    id: z.number().optional(),
    // deleted_reason: z.number(),
    deleted_reason: z.string().nonempty("Reason is required"),
    deleted_description:  z.string().nonempty("Description is required"),
})

export const BordereauStatusSchema = z.object({
    value: z.number(),
    label: z.string()
});

export type IOutcomeForm = z.infer<typeof OutcomeSchema>
export type IOutcomeHeaders = z.infer<typeof OutcomeSchema>
export type IOutcomeDelete = z.infer<typeof OutComeDelete>
export type IBordereauStatuses = z.infer<typeof BordereauStatusSchema>