import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import RecentOrders from "../../components/ecommerce/RecentOrders";

export default function Home() {

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <EcommerceMetrics
                            label="Bordereaux Uploaded"
                            value="11,987"
                        />
                        <EcommerceMetrics
                            label="Bordereaux Processed"
                            value="5,987"
                        />
                        <EcommerceMetrics label="Task Assigned" value="11" />
                        <EcommerceMetrics label="Task Completed" value="4" />
                    </div>
                </div>

                <div className="col-span-12 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <EcommerceMetrics
                            label="Bordereaux Queries"
                            value="234"
                        />
                        <EcommerceMetrics
                            label="Bordereaux Approaching Deadline"
                            value="87"
                        />
                        <EcommerceMetrics label="Tasks in Progress" value="7" />
                        <EcommerceMetrics label="Tasks Overdue" value="2" />
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
