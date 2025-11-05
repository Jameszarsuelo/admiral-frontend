export interface UserInfo {
    id: number;
    user_id: number;
    salutation: string;
    phone: string | null;
    mobile: string;
    address_line_1: string | null;
    address_line_2: string | null;
    address_line_3: string | null;
    city: string;
    county: string;
    country: string;
    postcode: string;
    created_by: number | null;
    updated_by: number | null;
    deleted_by: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}