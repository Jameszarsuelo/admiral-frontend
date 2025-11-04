import { UseFormSetError, FieldValues, Path } from "react-hook-form";

interface ValidationErrorResponse {
    errors: Record<string, string[]>;
}

export function handleValidationErrors<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>
): string {
    if (error && typeof error === "object" && "errors" in error) {
        const validationError = error as ValidationErrorResponse;
        const errors = validationError.errors;

        for (const [field, messages] of Object.entries(errors)) {
            const errorMessage = Array.isArray(messages)
                ? messages[0]
                : String(messages);
            setError(field as Path<T>, {
                type: "manual",
                message: errorMessage,
            });
        }

        return "Validation failed. Please check the form for errors.";
    }
    return "Failed to submit the form. Please try again.";
}
