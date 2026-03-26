import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"

import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-[1.25px] border-gray-300 bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-brand-500 focus-visible:ring-3 focus-visible:ring-brand-500/10 aria-invalid:border-destructive dark:border-gray-700 dark:focus-visible:border-brand-500 dark:focus-visible:ring-brand-500/10 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-brand-500 data-[state=checked]:bg-brand-500",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="relative flex items-center justify-center"
      >
        <span className="h-2 w-2 rounded-full bg-white" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
