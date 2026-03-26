import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import DashboardMetricCard from "@/components/dashboard/DashboardMetricCard";
import { useQuery } from "@tanstack/react-query";
import { fetchBordereauList } from "@/database/bordereau_api";
import { useOverviewDepartmentFilter } from "@/pages/Overview/useOverviewDepartmentFilter";
import OverviewDepartmentFilterCard from "@/pages/Overview/OverviewDepartmentFilterCard";
import { useDashboardOverviewMetrics } from "./useDashboardOverviewMetrics";

export default function Home() {
    const formatCount = (count: number) => new Intl.NumberFormat().format(count);

    const {
        departmentId,
        departmentIdNumber,
        departmentOptions,
        setDepartmentId,
    } = useOverviewDepartmentFilter();

    const {
        headcountValue,
        productionLineValue,
        outstandingQueriesValue,
        forecastValue,
        timTodayValue,
        timBotValue,
    } = useDashboardOverviewMetrics(departmentIdNumber);

    const departmentQuery = departmentIdNumber
        ? `?department_id=${departmentIdNumber}`
        : "";

    const overviewCardLink = (path: string) => `${path}${departmentQuery}`;

    const { data: bordereauSummary, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["dashboard", "bordereaux", "summary"],
        queryFn: () => fetchBordereauList({ page: 1, per_page: 1 }),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: processedList, isLoading: isProcessedLoading } = useQuery({
        queryKey: ["dashboard", "bordereaux", "processed"],
        queryFn: () =>
            fetchBordereauList({ page: 1, per_page: 1, invoice_status: "closed" }),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const uploadedTotal =
        bordereauSummary?.total ?? bordereauSummary?.data?.length ?? 0;
    const activitiesUploadedValue = isSummaryLoading
        ? "..."
        : formatCount(uploadedTotal);

    const processedTotal = processedList?.total ?? processedList?.data?.length ?? 0;
    const activitiesProcessedValue = isProcessedLoading
        ? "..."
        : formatCount(processedTotal);

    const activitiesQueriesValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.queryCount ?? 0);

    const activitiesApproachingDeadlineValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.deadlineTomorrowCount ?? 0);

    const overdueValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.overdueCount ?? 0);

    const maxPaymentTomorrowValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.deadlineTomorrowCount ?? 0);

    const targetDayTomorrowValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.targetdateCount ?? 0);

    const overdueMaxPaymentTargetWorkloadValue = isSummaryLoading
        ? "..."
        : formatCount(
              (bordereauSummary?.overdueCount ?? 0) +
                  (bordereauSummary?.deadlineTomorrowCount ?? 0) +
                  (bordereauSummary?.targetdateCount ?? 0),
          );

    const queuedValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.queuedCount ?? 0);

    const inProgressValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.inProgressCount ?? 0);

    const queryValue = isSummaryLoading
        ? "..."
        : formatCount(bordereauSummary?.queryCount ?? 0);

    const queuedWorkloadValue = isSummaryLoading
        ? "..."
        : formatCount(
              (bordereauSummary?.queuedCount ?? 0) +
                  (bordereauSummary?.inProgressCount ?? 0) +
                  (bordereauSummary?.queryCount ?? 0),
          );

    const activityDetailCards = [
        { key: "Overdue", label: "Overdue", value: overdueValue },
        {
            key: "MaxPayment",
            label: "Max Payment Day Tomorrow",
            value: maxPaymentTomorrowValue,
        },
        {
            key: "TargetDay",
            label: "Target Day Tomorrow",
            value: targetDayTomorrowValue,
        },
        {
            key: "OverdueMaxPaymentTargetWorkload",
            label: "Overdue / MaxPayment / TargetWorkload",
            value: overdueMaxPaymentTargetWorkloadValue,
        },
        { key: "Queued", label: "Queued", value: queuedValue },
        {
            key: "InProgress",
            label: "In Progress",
            value: inProgressValue,
        },
        { key: "Query", label: "Query", value: queryValue },
        {
            key: "QueuedWorkload",
            label: "Queued Workload",
            value: queuedWorkloadValue,
        },
    ];

    return (
        <>
            <PageBreadcrumb pageTitle="Dashboard" />

            <div className="space-y-6">
                {/* Business Overview */}
                <section className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Business Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        <DashboardMetricCard
                            label="Headcount"
                            value={headcountValue}
                            to={overviewCardLink("/overview/headcount")}
                        />

                        <DashboardMetricCard
                            label="Production Line"
                            value={productionLineValue}
                            to={overviewCardLink("/overview/production-line")}
                        />

                        <DashboardMetricCard
                            label="Outstanding Queries"
                            value={outstandingQueriesValue}
                            to={overviewCardLink("/overview/outstanding-queries")}
                        />

                        <DashboardMetricCard>
                            <OverviewDepartmentFilterCard
                                value={departmentId}
                                onChange={setDepartmentId}
                                options={departmentOptions}
                            />
                        </DashboardMetricCard>

                        <DashboardMetricCard
                            label="TIM (Today)"
                            value={timTodayValue}
                            to={overviewCardLink("/overview/tim-today")}
                        />

                        <DashboardMetricCard
                            label="TIM (BoT)"
                            value={timBotValue}
                            to={overviewCardLink("/overview/tim-bot")}
                        />

                        <DashboardMetricCard
                            label="Forecast"
                            value={forecastValue}
                            to={overviewCardLink("/overview/forecast")}
                        />

                        <DashboardMetricCard
                            label="Outstanding Referrals"
                            value="0"
                        />
                    </div>
                </section>

                {/* Activity Overview */}
                <section className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Activity Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        <DashboardMetricCard
                            label="Activities Uploaded"
                            value={activitiesUploadedValue}
                        />

                        <DashboardMetricCard
                            label="Activities Processed"
                            value={activitiesProcessedValue}
                        />

                        <DashboardMetricCard
                            label="Activities Queries"
                            value={activitiesQueriesValue}
                        />

                        <DashboardMetricCard
                            label="Activities Approaching Deadline"
                            value={activitiesApproachingDeadlineValue}
                        />
                    </div>
                </section>

                {/* Activity Detail */}
                <section className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Activity Detail
                        </h2>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        {activityDetailCards.map((card) => (
                            <DashboardMetricCard
                                key={card.key}
                                label={card.label}
                                value={card.value}
                            />
                        ))}
                    </div>
                </section>

                {/* Task Overview */}
                <section className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Task Overview
                        </h2>
                    </div>

                    <div className="grid grid-cols-12 gap-4 md:gap-6">
                        <DashboardMetricCard label="Task Assigned" value="0" />

                        <DashboardMetricCard label="Task Completed" value="0" />

                        <DashboardMetricCard label="Tasks in Progress" value="0" />

                        <DashboardMetricCard label="Tasks Overdue" value="0" />
                    </div>
                </section>
            </div>
        </>
    );
}
