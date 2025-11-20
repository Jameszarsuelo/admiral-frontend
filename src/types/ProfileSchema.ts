import { IRoleBase } from "@/types/RoleSchema";

export interface IProfileBase {
  id: number;
  role_id: number;
  name: string;
  created_at?: string | null;
  updated_at?: string | null;
  deleted_at?: string | null;
  role?: IRoleBase | null;
}

export interface IProfileForm {
  id?: number | undefined;
  role_id: number;
  name: string;
}

export type IProfileList = IProfileBase[];
