import { IBordereauIndex } from "@/types/BordereauSchema";
import BordereauSummaryGrid from "@/components/bordereau/BordereauSummaryGrid";
import CommentSection from "@/components/bordereau/CommentSection";
import Spinner from "@/components/ui/spinner/Spinner";

export default function BordereauDetailsView(
    {
        isLoading,
        bordereau: bordereauDetail,
    }: {
        isLoading: boolean;
        bordereau: IBordereauIndex | null;
    }
) {
    const isRecord = (value: unknown): value is Record<string, unknown> =>
        !!value && typeof value === "object" && !Array.isArray(value);

    const unwrap = (value: unknown, maxDepth = 5): unknown => {
        let current: unknown = value;

        for (let depth = 0; depth < maxDepth; depth++) {
            if (!isRecord(current)) return current;

            // If it already looks like a bordereau record, stop unwrapping.
            if (
                "claim_number" in current ||
                "supplier_id" in current ||
                "bordereau_status_id" in current
            ) {
                return current;
            }

            // Common API wrappers
            if ("data" in current) {
                current = (current as Record<string, unknown>).data;
                continue;
            }
            if ("bordereau" in current) {
                current = (current as Record<string, unknown>).bordereau;
                continue;
            }

            return current;
        }

        return current;
    };

    const raw: unknown = bordereauDetail;
    const normalized: unknown = unwrap(raw);

    const bord: IBordereauIndex | null = isRecord(normalized)
        ? (normalized as IBordereauIndex)
        : null;
    const bordExtra: Record<string, unknown> = isRecord(normalized)
        ? normalized
        : {};

    const display = (value: unknown): string => {
        if (value === null || value === undefined || value === "") return "-";
        return String(value);
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
                            <BordereauSummaryGrid bordereau={bord} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Claim Number
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.claim_number)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Name
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.name)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Supplier Ref
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.supplier_ref)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Registration Number
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.registration_number)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Invoice Date
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.invoice_date)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Lot Number
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.lot_number)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Invoice Number
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.invoice_number)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Branch Name
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.branch_name)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Out-of-Hours
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.out_of_hours)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    PH Name
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.ph_name)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    TP Name
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.tp_name)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Customer Name
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.customer_name)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Payment Code / Job Type
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.payment_code_job_type)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Total Payment Amount
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.total_payment_amount)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Copart Comments
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.copart_comments)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Location
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.location)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    ABI Group
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.abi_group)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Search Date
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.search_date)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Repair Excess
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.repair_excess)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Replace Excess
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.replace_excess)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Incident Start
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.incident_start)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Hire Start
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.hire_start_date)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Hire End
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.hire_end_date)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    QTY Days In Hire
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.qty_days_in_hire)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Daily Hire Rate
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.hire_daily_rate)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Group Hire Rate
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.group_hire_rate)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Admiral Invoice Type
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.admiral_invoice_type)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Amount Banked
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bord?.amount_banked)}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Task Type
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["task_type"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Rejection Reasons
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["rejection_reasons"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Additional Information
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["additional_information"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Make and Model
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["make_and_model"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Car Class Charged
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["car_class_charged"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Postcode
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["postcode"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Date
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["date"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Cat
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["cat"])}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Value
                                </p>
								<p className="text-base font-bold text-gray-800 dark:text-white/90">
                                    {display(bordExtra["value"])}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-1">
                            <div className="mb-10">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Activity Comments
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                                    <div>
                                        <CommentSection
                                            comments={bord?.comments}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-1">
                            <div className="mb-5">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Activity Audit
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                                    <div className="grid grid-cols-2">
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Created by
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {display(bord?.created_by)}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Created Date
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bord?.created_at
                                                ? new Date(
                                                      bord.created_at,
                                                  ).toLocaleString()
                                                : "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Updated by
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {display(bord?.updated_by)}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Updated Date
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bord?.updated_at
                                                ? new Date(
                                                      bord.updated_at,
                                                  ).toLocaleString()
                                                : "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Closed by
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {display(bord?.closed_by)}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Closed Date
                                        </p>
                                            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bord?.closed_date
                                                ? new Date(
                                                      bord.closed_date,
                                                  ).toLocaleString()
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* <div>
                                                        <BasicTableOne />
                                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
