import type z from "zod";
import type { UserFormSchema, UserListSchema } from "@/schema/UserFormSchema";

export type IUserForm = z.infer<typeof UserFormSchema>
export type IUserList = z.infer<typeof UserListSchema>