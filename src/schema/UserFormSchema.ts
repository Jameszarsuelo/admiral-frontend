import z from "zod";

export const UserFormSchema = z.object({
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
    twoFactor: z.boolean(),
    twofaType: z.string().nonempty("2FA type is required"),
    user_type_id: z.string().nonempty("User type is required"),
    address1: z.string().nonempty("Address line 1 is required"),
    address2: z.string().optional(),
    address3: z.string().optional(),
    city: z.string().nonempty("City is required"),
    county: z.string().nonempty("County is required"),
    country: z.string().nonempty("Country is required"),
    postcode: z.string().nonempty("Postcode is required"),
})