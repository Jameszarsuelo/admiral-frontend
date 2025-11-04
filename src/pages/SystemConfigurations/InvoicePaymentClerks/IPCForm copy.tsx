import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
// import {
//     InputGroup,
//     InputGroupAddon,
//     InputGroupText,
//     InputGroupTextarea,
// } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Switch from "@/components/form/switch/Switch";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";

const formSchema = z.object({
    firstname: z.string(),
    lastname: z.string(),
    email: z.string().email(),
    userProfile: z.string(),
    userType: z.string(),
    twoFactor: z.boolean(),
    TwofaType: z.string(),
    salutation: z.string(),
    phone: z.string(),
    mobile: z.string(),
    address1: z.string(),
    address2: z.string(),
    address3: z.string(),
    city: z.string(),
    county: z.string(),
    country: z.string(),
    postcode: z.string(),
});

export function IPCForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            email: "",
            userProfile: "",
            userType: "",
            twoFactor: false,
            TwofaType: "",
            salutation: "",
            phone: "",
            mobile: "",
            address1: "",
            address2: "",
            address3: "",
            city: "",
            county: "",
            country: "",
            postcode: "",
        },
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        // toast("You submitted the following values:", {
        //     description: (
        //         <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-black">
        //             <code>{JSON.stringify(data, null, 2)}</code>
        //         </pre>
        //     ),
        //     position: "bottom-right",
        //     classNames: {
        //         content: "flex flex-col gap-2",
        //     },
        //     style: {
        //         "--border-radius": "calc(var(--radius)  + 4px)",
        //     } as React.CSSProperties,
        // });
        console.log("Submitted data:", data);
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Invoice Payment Clerk" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Invoice Payment Clerks
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all invoice payment clerks and their
                                details.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            <form
                                id="form-ipc"
                                onSubmit={form.handleSubmit(onSubmit)}
                            >
                                <FieldGroup>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Controller
                                            name="firstname"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-firstname">
                                                        Firstname
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-firstname"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder="e.g. John"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="lastname"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-lastname">
                                                        Lastname
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-lastname"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder="e.g. Doe"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="email"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-email">
                                                        Email
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-email"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder="e.g. johndoe@test.com"
                                                        autoComplete="email"
                                                        type="email"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="userProfile"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-userProfile">
                                                        User Profile
                                                    </FieldLabel>
                                                    <Select
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="form-ipc-userProfile"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">
                                                                Monthly
                                                            </SelectItem>
                                                            <SelectItem value="yearly">
                                                                Yearly
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="userType"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-userType">
                                                        User Type
                                                    </FieldLabel>
                                                    <Select
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="form-ipc-userType"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">
                                                                Monthly
                                                            </SelectItem>
                                                            <SelectItem value="yearly">
                                                                Yearly
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <Controller
                                            name="twoFactor"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    orientation="horizontal"
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldContent>
                                                        <FieldLabel htmlFor="form-ipc-twoFactor">
                                                            Multi-factor
                                                            authentication
                                                        </FieldLabel>
                                                        <FieldDescription>
                                                            Enable multi-factor
                                                            authentication to
                                                            secure your account.
                                                        </FieldDescription>
                                                        {fieldState.invalid && (
                                                            <FieldError
                                                                errors={[
                                                                    fieldState.error,
                                                                ]}
                                                            />
                                                        )}
                                                    </FieldContent>
                                                    <Switch
                                                        label=""
                                                        defaultChecked={
                                                            field.value
                                                        }
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                    />
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="TwofaType"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-2faType">
                                                        2FA Type
                                                    </FieldLabel>
                                                    <Select
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="form-ipc-2faType"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="monthly">
                                                                Text Message
                                                            </SelectItem>
                                                            <SelectItem value="yearly">
                                                                Email
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-full">
                                            <Separator className="my-4" />
                                        </div>
                                        <Controller
                                            name="salutation"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-salutation">
                                                        Salutation
                                                    </FieldLabel>
                                                    <Select
                                                        name={field.name}
                                                        value={field.value}
                                                        onValueChange={
                                                            field.onChange
                                                        }
                                                    >
                                                        <SelectTrigger
                                                            id="form-ipc-salutation"
                                                            aria-invalid={
                                                                fieldState.invalid
                                                            }
                                                        >
                                                            <SelectValue placeholder="Select" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="Mr.">
                                                                Mr.
                                                            </SelectItem>
                                                            <SelectItem value="Ms.">
                                                                Ms.
                                                            </SelectItem>
                                                            <SelectItem value="Mrs.">
                                                                Mrs.
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="phone"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-phone">
                                                        Phone
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-phone"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. Address line 1"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="mobile"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-mobile">
                                                        Mobile
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-mobile"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. Address line 1"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="address1"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-address1">
                                                        Address 1
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-address1"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. Address line 1"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="address2"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-address2">
                                                        Address 2
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-address2"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. Address line 2"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="address3"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-address3">
                                                        Address 3
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-address3"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. Address line 3"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="city"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-city">
                                                        City
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-city"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        // placeholder="e.g. City"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        <Controller
                                            name="county"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-county">
                                                        County
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-county"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="country"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-country">
                                                        Country
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-country"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />
                                        <Controller
                                            name="postcode"
                                            control={form.control}
                                            render={({ field, fieldState }) => (
                                                <Field
                                                    data-invalid={
                                                        fieldState.invalid
                                                    }
                                                >
                                                    <FieldLabel htmlFor="form-ipc-postcode">
                                                        Postcode
                                                    </FieldLabel>
                                                    <Input
                                                        {...field}
                                                        id="form-ipc-postcode"
                                                        aria-invalid={
                                                            fieldState.invalid
                                                        }
                                                        placeholder="e.g. postcode"
                                                        autoComplete="off"
                                                    />
                                                    {fieldState.invalid && (
                                                        <FieldError
                                                            errors={[
                                                                fieldState.error,
                                                            ]}
                                                        />
                                                    )}
                                                </Field>
                                            )}
                                        />

                                        {/* <Controller
                                name="description"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-ipc-description">
                                            Description
                                        </FieldLabel>
                                        <InputGroup>
                                            <InputGroupTextarea
                                                {...field}
                                                id="form-ipc-description"
                                                placeholder="I'm having an issue with the login button on mobile."
                                                rows={6}
                                                className="min-h-24 resize-none"
                                                aria-invalid={
                                                    fieldState.invalid
                                                }
                                            />
                                            <InputGroupAddon align="block-end">
                                                <InputGroupText className="tabular-nums">
                                                    {field.value.length}/100
                                                    characters
                                                </InputGroupText>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        <FieldDescription>
                                            Include steps to reproduce, expected
                                            behavior, and what actually
                                            happened.
                                        </FieldDescription>
                                        {fieldState.invalid && (
                                            <FieldError
                                                errors={[fieldState.error]}
                                            />
                                        )}
                                    </Field>
                                )}
                            /> */}
                                    </div>
                                </FieldGroup>
                            </form>

                            <Field orientation="horizontal" className="mt-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => form.reset()}
                                >
                                    Reset
                                </Button>
                                <Button type="submit" form="form-ipc">
                                    Submit
                                </Button>
                            </Field>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
