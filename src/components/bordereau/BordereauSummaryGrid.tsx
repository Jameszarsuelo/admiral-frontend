import { dateFormat } from "@/helper/dateFormat";
import { IBordereauIndex } from "@/types/BordereauSchema";

interface Props {
    bordereau?: IBordereauIndex;
}

export default function BordereauSummaryGrid({ bordereau }: Props) {
    // const fmt = (v?: string | number | null) => {
    //     if (v === null || v === undefined || v === "") return "-";
    //     if (typeof v === "string") {
    //         // try date detection
    //         const d = new Date(v);
    //         if (!isNaN(d.getTime()) && v.indexOf("-") >= 0) return d.toLocaleString();
    //         return v;
    //     }
    //     return String(v);
    // };

    const cards: { title: string; value: string | number }[] = [
        { title: "Supplier", value: bordereau?.supplier?.name ?? "-" },
        { title: "Status", value: bordereau?.bordereau_status?.status ?? "-" },
        { title: "Place in Queue", value: bordereau?.place_in_queue ? bordereau?.place_in_queue : "-" },
        {
            title: "Assigned / Processed by",
            value: bordereau?.bpc
                ? `${bordereau?.bpc?.contact?.firstname} ${bordereau?.bpc?.contact?.lastname}`
                : "Unassigned",
        },
        { title: "Uploaded", value: dateFormat(bordereau!.created_at) },
        { title: "Target", value: bordereau?.target_payment_date ? dateFormat(bordereau?.target_payment_date) : "-" },
        { title: "Deadline", value: bordereau?.deadline_payment_date ? dateFormat(bordereau?.deadline_payment_date) : "-" },
        { title: "Closed", value: bordereau?.closed_date ? dateFormat(bordereau?.closed_date) : "-" },
        { title: "Upload Batch", value: bordereau?.upload_batch_number ?? "-" },
        { title: "Success", value: bordereau?.bordereau_success ? "Yes" : "No" },
        { title: "Open / Closed", value: bordereau?.bordereau_closed ? "Closed" : "Open" },
        { title: "Query Iterations", value: bordereau?.query_iterations ?? "-" },
        { title: "Elapsed", value: bordereau?.time_to_success_elapsed ?? "-" },
        { title: "Process", value: bordereau?.time_to_process ?? "-" },
        { title: "Last Updated", value: bordereau?.updated_at ? dateFormat(bordereau?.updated_at) : "-" },
    ];

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {cards.map((c) => (
                    <div
                        key={c.title}
                        className="flex items-center gap-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 shadow-md"
                    >
                        <div className="flex-shrink-0">
                            <div className="h-12 w-12 rounded-full bg-cyan-50 dark:bg-cyan-900 flex items-center justify-center">
                                <svg
                                    className="h-6 w-6 text-cyan-600 dark:text-cyan-300"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-hidden
                                >
                                    <path
                                        d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M2 7h20v5H2z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 7v10"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M8 4c1.333-1.333 3-1 4 0s2.667 1.333 4 0"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col min-w-0">
                            <div className="text-sm text-slate-500 dark:text-slate-300 font-medium truncate">
                                {c.title}
                            </div>
                            <div className="mt-1 text-base font-semibold text-slate-900 dark:text-white truncate">
                                {c.value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
