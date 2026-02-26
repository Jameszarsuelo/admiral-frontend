import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Select from "@/components/form/Select";
import EcommerceMetrics from "@/components/ecommerce/EcommerceMetrics";
import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/button/Button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
    fetchForecastSnapshot,
    fetchHeadcountToday,
    fetchOverviewQueueList,
    fetchTimBotSnapshot,
    fetchTimTodaySnapshot,
} from "@/database/overview_api";
import { queueBordereauForBpc } from "@/database/bordereau_api";
import {
    getOverviewQueuedColumns,
    type OverviewQueuedRow,
} from "@/data/OverviewQueuedHeaders.tsx";
import { useMemo, useState } from "react";

export default function OverviewIndex() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [includeCompleted, setIncludeCompleted] = useState(false);

    const { data: headcountToday } = useQuery({
        queryKey: ["overview", "headcount", "today", "headline"],
        queryFn: fetchHeadcountToday,
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: forecastSnapshot } = useQuery({
        queryKey: ["overview", "forecast", "headline"],
        queryFn: fetchForecastSnapshot,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const headcountValue = new Intl.NumberFormat().format(
        headcountToday?.online_count ?? 0,
    );
    const forecastValue = `${Number(forecastSnapshot?.projected_days ?? 0).toFixed(2)} day(s)`;

    const { data: timTodaySnapshot } = useQuery({
        queryKey: ["overview", "tim-today", "headline"],
        queryFn: fetchTimTodaySnapshot,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const timTodayValue = timTodaySnapshot?.headline_aht ?? "00:00:00";

    const { data: timBotSnapshot } = useQuery({
        queryKey: ["overview", "tim-bot", "headline"],
        queryFn: fetchTimBotSnapshot,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 60_000,
    });

    const timBotValue = timBotSnapshot?.headline_aht ?? "00:00:00";

    const { data: queueListData } = useQuery({
        queryKey: ["overview", "queue-list", includeCompleted],
        queryFn: () => fetchOverviewQueueList(includeCompleted),
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const processNextMutation = useMutation({
        mutationFn: async (bordereauId: number) => {
            await queueBordereauForBpc({ bordereau_id: bordereauId });
        },
        onSuccess: () => {
            toast.success("Bordereau queued to process next");
            void queryClient.invalidateQueries({ queryKey: ["overview", "queue-list"] });
        },
        onError: (error) => {
            const message =
                error instanceof Error
                    ? error.message
                    : "Failed to queue bordereau for processing";
            toast.error(message);
        },
    });

    const queuedRows: OverviewQueuedRow[] = queueListData?.rows ?? [];

    const overviewQueuedColumns = useMemo(
        () =>
            getOverviewQueuedColumns({
                onProcessNext: (bordereauId: number) =>
                    processNextMutation.mutate(bordereauId),
                processNextPending: processNextMutation.isPending,
            }),
        [processNextMutation],
    );

    return (
        <>
            <PageBreadcrumb pageTitle="Overview" />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/headcount")}
                    >
                        <EcommerceMetrics
                            label="Headcount"
                            value={headcountValue}
                        />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/production-line")}
                    >
                        <EcommerceMetrics
                            label="Production Line"
                            value="4,057"
                        />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/outstanding-queries")}
                    >
                        <EcommerceMetrics
                            label="Outstanding Queries"
                            value="278"
                        />
                    </button>
                </div>

                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 md:p-6">
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 dark:text-white/90">
                                Department
                            </h4>
                            <div className="mt-3">
                                <Select
                                    value="all"
                                    onChange={() => {}}
                                    options={[{ value: "all", label: "all" }]}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/tim-today")}
                    >
                        <EcommerceMetrics label="TIM (Today)" value={timTodayValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/tim-bot")}
                    >
                        <EcommerceMetrics label="TIM (BoT)" value={timBotValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <button
                        type="button"
                        className="w-full text-left"
                        onClick={() => navigate("/overview/forecast")}
                    >
                        <EcommerceMetrics label="Forecast" value={forecastValue} />
                    </button>
                </div>
                <div className="col-span-12 sm:col-span-6 xl:col-span-3">
                    <EcommerceMetrics label="Outstanding Referrals" value="0" />
                </div>

                <div className="col-span-12">
                    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                        <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                            <div className="w-full">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                    List of Bordereau Queued / In Progress
                                </h3>
                            </div>
                            <div className="flex items-center gap-2 self-start sm:self-center rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                                <span className="text-sm text-gray-800 dark:text-white/90">
                                    Include Completed?
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant={includeCompleted ? "outline" : "primary"}
                                        onClick={() => setIncludeCompleted(false)}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant={includeCompleted ? "primary" : "outline"}
                                        onClick={() => setIncludeCompleted(true)}
                                    >
                                        Yes
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div className="max-w-full overflow-x-auto custom-scrollbar">
                            <div className="min-w-[1000px] xl:min-w-full px-2">
                                <DataTable
                                    columns={overviewQueuedColumns}
                                    data={queuedRows}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
