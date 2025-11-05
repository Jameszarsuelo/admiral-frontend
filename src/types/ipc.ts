import { UserInfo } from "./userInfo";
import { UserProfile } from "./userProfile";
import { UserType } from "./userType";

export interface IPCFormData {
    id?: number;
    firstname: string;
    lastname: string;
    email: string;
    twoFactor: boolean;
    twofaType: string;
    salutation: string;
    phone: string;
    mobile: string;
    address1: string;
    address2?: string;
    address3?: string;
    city: string;
    county: string;
    country: string;
    postcode: string;
}

export interface IPCDetails {
    id: number;
    user_id: number;
    ipc_status_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface IPCResponse {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    user_profile_id: number;
    user_type_id: number;
    is_active: number;
    "2fa_enabled": number;
    "2fa_type": number;
    sso_provider: string | null;
    sso_sub: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_info: UserInfo;
    user_type: UserType;
    user_profile: UserProfile;
    ipc: IPCDetails;
}

export type IPC = IPCFormData;