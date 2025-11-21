import { z } from "zod";

const NonEmptyString = z.string().min(1);

export const DocumentVisibilityBaseSchema = z.object({
    id: z.number().int().positive(),
    name: NonEmptyString,
    //   created_at: z.string().datetime(),
    //   updated_at: z.string().datetime(),
    //   deleted_at: z.string().datetime().nullable().optional(),
});

export const DocumentVisibilityCreateSchema = z.object({
    name: NonEmptyString,
});

export const DocumentVisibilityUpdateSchema =
    DocumentVisibilityCreateSchema.partial().extend({
        id: z.number().int().positive(),
    });

export const DocumentTypeBaseSchema = z.object({
    id: z.number().int().positive(),
    type: NonEmptyString,
    //   created_at: z.string().datetime(),
    //   updated_at: z.string().datetime(),
    //   deleted_at: z.string().datetime().nullable().optional(),
});

export const DocumentTypeCreateSchema = z.object({
    type: NonEmptyString,
});

export const DocumentTypeUpdateSchema =
    DocumentTypeCreateSchema.partial().extend({
        id: z.number().int().positive(),
    });

export const DocumentBaseSchema = z.object({
    id: z.number().int().positive(),
    name: z.union([z.string().optional(), z.instanceof(File)]),
    revision: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    document_type_id: z.number().int().positive(),
    expiry_date: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    document_visibility_id: z.number().int().positive(),
    supplier_id: z.number().int().positive(),
    uploaded_by: z.number().int().positive(),
    updated_by: z.number().int().positive(),
    document_type: DocumentTypeBaseSchema,
    document_visibility: DocumentVisibilityBaseSchema,
    supplier: z.object({ name: NonEmptyString }).optional(),

    //   created_at: z.string().datetime(),
    //   updated_at: z.string().datetime(),
});

export const DocumentFormSchema = DocumentBaseSchema.omit({
    document_type: true,
    document_visibility: true,
    supplier: true,
    uploaded_by: true,
    updated_by: true,
});

export const DocumentCreateSchema = z.object({
    name: z.union([z.string().optional(), z.instanceof(File)]), // Accept either string or File
    revision: z.string().optional(),
    description: z.string().optional(),
    document_type_id: z.number().int().optional(),
    expiry_date: z.string().optional(),
    location: z.string().optional(),
    document_visibility_id: z.number().int().optional(),
    uploaded_by: z.number().int().positive(),
    updated_by: z.number().int().optional(),
});

export const DocumentUpdateSchema = DocumentCreateSchema.partial().extend({
    id: z.number().int().positive(),
});

export type IDocumentSchema = z.infer<typeof DocumentBaseSchema>;
export type IDocumentFormSchema = z.infer<typeof DocumentFormSchema>;
export type IDocumentTypeSchema = z.infer<typeof DocumentTypeBaseSchema>;
export type IDocumentVisibilitySchema = z.infer<
    typeof DocumentVisibilityBaseSchema
>;
