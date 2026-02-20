import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import { useQuery } from "@tanstack/react-query";
import { fetchBordereauList } from "@/database/bordereau_api";

export default function Home() {

    const formatCount = (count: number) => new Intl.NumberFormat().format(count);

    const { data: bordereauList, isLoading: isBordereauxLoading } = useQuery({
        queryKey: ["dashboard", "bordereaux", "uploaded"],
        queryFn: () => fetchBordereauList({ page: 1, per_page: 1 }),
        staleTime: 60_000,
    });

    const { data: processedList, isLoading: isProcessedLoading } = useQuery({
        queryKey: ["dashboard", "bordereaux", "processed"],
        queryFn: () => fetchBordereauList({ page: 1, per_page: 1, invoice_status: "closed" }),
        staleTime: 60_000,
    });

    const bordereauxUploadedTotal = bordereauList?.total ?? bordereauList?.data?.length ?? 0;
    const bordereauxUploadedValue = isBordereauxLoading ? "..." : formatCount(bordereauxUploadedTotal);

    const bordereauxProcessedTotal = processedList?.total ?? processedList?.data?.length ?? 0;
    const bordereauxProcessedValue = isProcessedLoading ? "..." : formatCount(bordereauxProcessedTotal);

    const bordereauxQueriesValue = isBordereauxLoading
        ? "..."
        : formatCount(bordereauList?.queryCount ?? 0);

    // Interpreting "Approaching Deadline" as "Max Payment Day Tomorrow" from the API.
    const bordereauxApproachingDeadlineValue = isBordereauxLoading
        ? "..."
        : formatCount(bordereauList?.deadlineTomorrowCount ?? 0);

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <EcommerceMetrics
                            label="Bordereaux Uploaded"
                            value={bordereauxUploadedValue}
                        />
                        <EcommerceMetrics
                            label="Bordereaux Processed"
                            value={bordereauxProcessedValue}
                        />
                        <EcommerceMetrics label="Task Assigned" value="0" />
                        <EcommerceMetrics label="Task Completed" value="0" />
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <EcommerceMetrics
                            label="Bordereaux Queries"
                            value={bordereauxQueriesValue}
                        />
                        <EcommerceMetrics
                            label="Bordereaux Approaching Deadline"
                            value={bordereauxApproachingDeadlineValue}
                        />
                        <EcommerceMetrics label="Tasks in Progress" value="0" />
                        <EcommerceMetrics label="Tasks Overdue" value="0" />
                    </div>
                </div>

                <div className="col-span-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <RecentOrders />
                        <RecentOrders />
                    </div>
                </div>
            </div>
        </>
    );
}
