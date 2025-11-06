import { IUser, UserResponse } from "./user";
import { UserInfo } from "./userInfo";
import { UserProfile } from "./userProfile";
import { UserType } from "./userType";

export interface IPCDetails {
    id: number;
    user_id: number;
    ipc_status_id: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface IPCResponse extends IPCDetails {
    user: UserResponse & {
        user_info: UserInfo;
        user_type: UserType;
        user_profile: UserProfile;
    };
}

export type IPC = IUser;
