import type z from "zod";
import { SupplierFormSchema, SupplierSchema } from "@/schema/SupplierFormSchema";

export type ISupplierSchema = z.infer<typeof SupplierSchema>;
export type ISupplierFormSchema = z.infer<typeof SupplierFormSchema>;
