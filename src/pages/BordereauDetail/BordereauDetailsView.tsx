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
    return (
        <div className="min-w-full xl:min-w-full px-2">
            {isLoading ? (
                <Spinner />
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-2 ">
                        {/* Summary grid (responsive cards) */}
                        <div className="mt-6 mb-6">
                            <BordereauSummaryGrid bordereau={bordereauDetail!} />
                        </div>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4 lg:gap-7 2xl:gap-x-32">
                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Claim Number
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.claim_number ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.name ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Supplier Ref
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.supplier_ref ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Registration Number
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.registration_number ??
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Invoice Date
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.invoice_date}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Lot Number
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.lot_number ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Invoice Number
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.invoice_number ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Branch Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.branch_name ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Out-of-Hours
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.out_of_hours ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    PH Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.ph_name ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    TP Name
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.tp_name ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Payment Code / Job Type
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.payment_code_job_type ??
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Total Payment Amount
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.total_payment_amount}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Copart Comments
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.copart_comments ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Location
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.location ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    ABI Group
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.abi_group ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Search Date
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.search_date ?? "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Repair Excess
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.repair_excess}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Replace Excess
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.replace_excess}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Incident Start
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.incident_start}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Hire Start
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.hire_start_date}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Hire End
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.hire_end_date}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    QTY Days In Hire
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.qty_days_in_hire}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Daily Hire Rate
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.hire_daily_rate}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Group Hire Rate
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.group_hire_rate}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Admiral Invoice Type
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.admiral_invoice_type ??
                                        "-"}
                                </p>
                            </div>

                            <div>
                                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                    Amount Banked
                                </p>
                                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                    {bordereauDetail?.amount_banked}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-1">
                            <div className="mb-10">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Bordereau Comments
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                                    <div>
                                        <CommentSection
                                            comments={bordereauDetail?.comments}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6 col-span-1">
                            <div className="mb-5">
                                <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
                                    Bordereau Audit
                                </h4>
                                <div className="grid grid-cols-1 gap-4 lg:grid-cols-1 lg:gap-7">
                                    <div className="grid grid-cols-2">
                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Created by
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.created_by ?? "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Created Date
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.created_at
                                                ? new Date(
                                                      bordereauDetail.created_at,
                                                  ).toLocaleString()
                                                : "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Updated by
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.updated_by ?? "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Updated Date
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.updated_at
                                                ? new Date(
                                                      bordereauDetail.updated_at,
                                                  ).toLocaleString()
                                                : "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Closed by
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.closed_by ?? "-"}
                                        </p>

                                        <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                                            Closed Date
                                        </p>
                                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                                            {bordereauDetail?.closed_date
                                                ? new Date(
                                                      bordereauDetail.closed_date,
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
