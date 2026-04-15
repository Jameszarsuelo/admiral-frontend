import { IBordereauIndex } from "@/types/BordereauSchema";
import BordereauSummaryGrid from "@/components/bordereau/BordereauSummaryGrid";
import Spinner from "@/components/ui/spinner/Spinner";

export default function BordereauDetailsViewBPC({
    isLoading,
    bordereau: bordereauDetail,
    validationFields,
}: {
    isLoading: boolean;
    bordereau: IBordereauIndex | null;
    validationFields?: Record<string, unknown> | null;
}) {

    // Work Types (bordereau_validation flags) don't perfectly match the bordereau payload keys
    // used in this details grid. Normalize common aliases so checked fields actually display.
    const validationKeyAliases: Record<string, string[]> = {
        lot_number: ["lot_number", "lot_no"],
        hire_daily_rate: ["hire_daily_rate", "daily_hire_rate", "daily_rate"],
        qty_days_in_hire: ["qty_days_in_hire", "number_of_days_in_hire"],
        copart_comments: ["copart_comments", "comments", "comment"],
        group_hire_rate: ["group_hire_rate", "group_rate"],
    };

    const shouldShow = (key: string): boolean => {
        if (!validationFields) return true;

        const keysToCheck = validationKeyAliases[key] ?? [key];
        return keysToCheck.some((k) => Boolean(validationFields[k]));
    };
    return (
        <div className="min-w-full xl:min-w-full px-2">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-2 ">
                        {/* Summary grid (responsive cards) */}
                        <div className="mt-6 mb-6">
                            <BordereauSummaryGrid
                                bordereau={bordereauDetail!}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                            {(
                                [
                                    ["claim_number", "Claim Number"],
                                    ["name", "Name"],
                                    ["supplier_ref", "Supplier Ref"],
                                    ["registration_number", "Registration Number"],
                                    ["invoice_date", "Invoice Date"],
                                    ["lot_number", "Lot Number"],
                                    ["invoice_number", "Invoice Number"],
                                    ["branch_name", "Branch Name"],
                                    ["out_of_hours", "Out-of-Hours"],
                                    ["ph_name", "PH Name"],
                                    ["tp_name", "TP Name"],
                                    ["customer_name", "Customer Name"],
                                    ["payment_code_job_type", "Payment Code / Job Type"],
                                    ["total_payment_amount", "Total Payment Amount"],
                                    ["copart_comments", "Copart Comments"],
                                    ["location", "Location"],
                                    ["abi_group", "ABI Group"],
                                    ["search_date", "Search Date"],
                                    ["repair_excess", "Repair Excess"],
                                    ["replace_excess", "Replace Excess"],
                                    ["incident_start", "Incident Start"],
                                    ["incident_date", "Incident Date"],
                                    ["hire_start_date", "Hire Start"],
                                    ["hire_end_date", "Hire End"],
                                    ["qty_days_in_hire", "QTY Days In Hire"],
                                    ["hire_daily_rate", "Daily Hire Rate"],
                                    ["group_hire_rate", "Group Hire Rate"],
                                    ["admiral_invoice_type", "Admiral Invoice Type"],
                                    ["amount_banked", "Amount Banked"],
                                    ["task_type", "Task Type"],
                                    ["rejection_reasons", "Rejection Reasons"],
                                    ["additional_information", "Additional Information"],
                                    ["make_and_model", "Make and Model"],
                                    ["car_class_charged", "Car Class Charged"],
                                    ["postcode", "Postcode"],
                                    ["date", "Date"],
                                    ["cat", "Cat"],
                                    ["value", "Value"],
                                ] as Array<[string, string]>
                            ).map(([key, label]) =>
                                shouldShow(key) ? (
                                    <div key={key}>
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            {label}
                                        </p>
                                        <p className="text-base font-bold text-gray-800 dark:text-white/90">
                                            {String(((bordereauDetail as Record<string, unknown>)?.[key] ?? "-"))}
                                        </p>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
