import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import { Field, FieldGroup } from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import Button from "@/components/ui/button/Button";
// import PhoneInput from "@/components/form/group-input/PhoneInput";
// import Select from "@/components/form/Select";
// import Switch from "@/components/form/switch/Switch";
// import { Separator } from "@/components/ui/separator";
import { useParams } from "react-router";
import { TimeIcon } from "@/icons";
import Radio from "@/components/form/input/Radio";
import { useState } from "react";

const formSchema = z.object({
    firstname: z.string().min(1, "First name is required"),
});

// const countries = [
//     { code: "US", label: "+1" },
//     { code: "GB", label: "+44" },
//     { code: "CA", label: "+1" },
//     { code: "AU", label: "+61" },
//     { code: "PH", label: "+63" },
// ];
// const twofaTypeOptions = [
//     { value: "sms", label: "SMS" },
//     { value: "email", label: "Email" },
// ];

// const salutationOptions = [
//     { value: "mr", label: "Mr." },
//     { value: "ms", label: "Ms." },
//     { value: "mrs", label: "Mrs." },
//     { value: "dr", label: "Dr." },
// ];

export function PlanningForm() {
    const { id } = useParams();
    const [selectedValue, setSelectedValue] = useState<string>("option2");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
        },
    });

    const handleRadioChange = (value: string) => {
        setSelectedValue(value);
    };

    function onSubmit(data: z.infer<typeof formSchema>) {
        toast("You submitted the following values:", {
            description: (
                <pre className="bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4 text-black">
                    <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
            position: "bottom-right",
            classNames: {
                content: "flex flex-col gap-2",
            },
            style: {
                "--border-radius": "calc(var(--radius)  + 4px)",
            } as React.CSSProperties,
        });
        console.log("Submitted data:", data);
    }

    return (
        <>
            <PageBreadcrumb pageTitle="Supplier" />
            <ComponentCard title={id ? "Edit Supplier" : "Add Supplier"}>
                <form id="form-supplier" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="grid grid-cols-4 gap-6 ">
                            <div className="col-span-4 grid grid-cols-subgrid gap-6">
                                <Controller
                                    name="firstname"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Working Hours ( Start - End )
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    id="tm"
                                                    name="tm"
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <TimeIcon className="size-6" />
                                                </span>
                                            </div>
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="firstname"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                &nbsp;
                                            </Label>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    type="time"
                                                    id="tm"
                                                    name="tm"
                                                />
                                                {fieldState.error && (
                                                    <p className="mt-1 text-sm text-error-500">
                                                        {
                                                            fieldState.error
                                                                .message
                                                        }
                                                    </p>
                                                )}
                                                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                                                    <TimeIcon className="size-6" />
                                                </span>
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="col-span-4 grid grid-cols-subgrid gap-6 mt-5">
                                <div className="grid">
                                    <Label htmlFor="radio1">
                                        Able to Work on Saturday
                                    </Label>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <Radio
                                            id="radio1"
                                            name="group1"
                                            value="option1"
                                            checked={
                                                selectedValue === "option1"
                                            }
                                            onChange={handleRadioChange}
                                            label="Default"
                                        />
                                        <Radio
                                            id="radio2"
                                            name="group1"
                                            value="option2"
                                            checked={
                                                selectedValue === "option2"
                                            }
                                            onChange={handleRadioChange}
                                            label="Selected"
                                        />
                                    </div>
                                </div>

                                <div className="grid">
                                    <Label htmlFor="radio1">
                                        Able to Work on Sunday
                                    </Label>
                                    <div className="flex flex-wrap items-center gap-8">
                                        <Radio
                                            id="radio1"
                                            name="group2"
                                            value="option1"
                                            checked={
                                                selectedValue === "option1"
                                            }
                                            onChange={handleRadioChange}
                                            label="Default"
                                        />
                                        <Radio
                                            id="radio2"
                                            name="group2"
                                            value="option2"
                                            checked={
                                                selectedValue === "option2"
                                            }
                                            onChange={handleRadioChange}
                                            label="Selected"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-2 grid gap-6  mt-5">
                                <Controller
                                    name="firstname"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="input">
                                                Forecast Horizon
                                            </Label>
                                            <Input
                                                {...field}
                                                type="text"
                                                id="input"
                                                name="firstname"
                                                placeholder="Default: 5"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>
                        </div>
                    </FieldGroup>
                </form>

                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-supplier">
                        Submit
                    </Button>
                </div>
            </ComponentCard>
        </>
    );
}
