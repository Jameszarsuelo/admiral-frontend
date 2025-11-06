import { UserInfo } from "./userInfo";
import { UserProfile } from "./userProfile";
import { UserType } from "./userType";

export interface SupplierDetails {
    id: number;
    user_id: number;
    vat_number: string;
    invoice_query_email: string;
    phone: string | null;
    max_payment_days: number;
    target_payment_days: number;
    preferred_payment_day: string | null;
    priority: number;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

export interface SupplierUser {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    user_profile_id: number;
    user_type_id: number;
    is_active: number;
    two_fa_enabled: number;
    two_fa_type: number;
    sso_provider: string | null;
    sso_sub: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    user_info: UserInfo;
    user_type: UserType;
    user_profile: UserProfile;
}

export interface SupplierResponse extends SupplierDetails {
    user: SupplierUser;
}

// export interface SupplierUpsert {
//     id?: number;
//     firstname: string;
//     lastname: string;
//     email: string;
//     two_fa_enabled: boolean;
//     two_fa_type: number;
//     salutation: string;
//     phone: string;
//     mobile: string;
//     address1: string;
//     address2?: string;
//     address3?: string;
//     city: string;
//     county: string;
//     country: string;
//     postcode: string;
//     vatNumber: string;
//     invoiceQueryEmail: string;
//     maxPaymentDays: number;
//     targetPaymentDays: number;
//     preferredPaymentDay: number;
//     priority: number;
// }