import z from "zod";

const UserType = z.object({
    id: z.number(),
    type: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional().nullable(),
});

const UserProfile = z.object({
    id: z.number(),
    name: z.string(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional().nullable(),
});

const UserInfo = z.object({
    id: z.number(),
    user_id: z.number,
    salutation: z.string().nonempty("Salutation is required"),
    phone: z.string().nonempty("Phone is required").nullable(),
    mobile: z
        .string()
        .nonempty("Mobile number is required")
        .regex(
            /^\+?\d+$/,
            "Mobile number must contain only numbers and an optional + at the start",
        ),
    address_line_1: z.string().nonempty("Address line 1 is required").nullable(),
    address_line_2: z.string().optional().nullable(),
    address_line_3: z.string().optional().nullable(),
    city: z.string().nonempty("City is required"),
    county: z.string().nonempty("County is required"),
    country: z.string().nonempty("Country is required"),
    postcode: z.string().nonempty("Postcode is required"),
    created_by: z.number().optional().nullable(),
    updated_by: z.number().optional().nullable(),
    deleted_by: z.number().optional().nullable(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional().nullable(),
});


export const UserFormSchema = z.object({
    id: z.number().optional(),
    salutation: z.string().nonempty("Salutation is required"),
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    email: z.email().nonempty("Invalid email address"),
    phone: z.string().nonempty("Phone is required"),
    mobile: z
        .string()
        .nonempty("Mobile number is required")
        .regex(
            /^\+?\d+$/,
            "Mobile number must contain only numbers and an optional + at the start",
        ),
    two_fa_enabled: z.boolean(),
    two_fa_type: z.number(),
    user_type_id: z.number(),
    user_profile_id: z.number(),
    address1: z.string().nonempty("Address line 1 is required"),
    address2: z.string().optional(),
    address3: z.string().optional(),
    city: z.string().nonempty("City is required"),
    county: z.string().nonempty("County is required"),
    country: z.string().nonempty("Country is required"),
    postcode: z.string().nonempty("Postcode is required"),
    created_by: z.number().optional(),
    updated_by: z.number().optional(),
    deleted_by: z.number().optional(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
    deleted_at: z.string().optional(),
});

export const UserListSchema = UserFormSchema.omit({
    salutation:true,   
    address1: true,  
    address2: true,   
    address3: true,   
    phone: true,   
    mobile: true,   
    city: true,   
    county: true,   
    country: true,   
    postcode: true,   
}).extend({
    sso_provider: z.string().optional().nullable(),
    sso_sub: z.string().optional().nullable(),
    email_verified_at: z.string().optional().nullable(),
    is_active: z.number().optional(),
    user_info: UserInfo,
    user_type: UserType,
    user_profile: UserProfile,
});