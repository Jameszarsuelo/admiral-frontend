import { useQuery } from "@tanstack/react-query";
import {
    fetchForecastSnapshot,
    fetchHeadcountToday,
    fetchOutstandingQueries,
    fetchProductionLineToday,
    fetchTimBotSnapshot,
    fetchTimTodaySnapshot,
} from "@/database/overview_api";

export interface DashboardOverviewMetricsValues {
    headcountValue: string;
    productionLineValue: string;
    outstandingQueriesValue: string;
    forecastValue: string;
    timTodayValue: string;
    timBotValue: string;
}

export function useDashboardOverviewMetrics(
    departmentIdNumber?: number,
): DashboardOverviewMetricsValues {
    const { data: headcountToday, isLoading: isHeadcountLoading } = useQuery({
        queryKey: [
            "dashboard",
            "overview",
            "headcount",
            "today",
            departmentIdNumber,
        ],
        queryFn: () => fetchHeadcountToday(departmentIdNumber, false),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: productionLineToday, isLoading: isProductionLineLoading } =
        useQuery({
            queryKey: [
                "dashboard",
                "overview",
                "production-line",
                "headline",
                departmentIdNumber,
            ],
            queryFn: () => fetchProductionLineToday(departmentIdNumber),
            refetchInterval: 5_000,
            refetchIntervalInBackground: true,
            staleTime: 0,
        });

    const { data: outstandingQueries, isLoading: isOutstandingQueriesLoading } =
        useQuery({
            queryKey: [
                "dashboard",
                "overview",
                "outstanding-queries",
                "headline",
                departmentIdNumber,
            ],
            queryFn: () => fetchOutstandingQueries(departmentIdNumber),
            refetchInterval: 5_000,
            refetchIntervalInBackground: true,
            staleTime: 0,
        });

    const { data: forecastSnapshot, isLoading: isForecastLoading } = useQuery({
        queryKey: [
            "dashboard",
            "overview",
            "forecast",
            "headline",
            departmentIdNumber,
        ],
        queryFn: () => fetchForecastSnapshot(departmentIdNumber),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: timTodaySnapshot, isLoading: isTimTodayLoading } = useQuery({
        queryKey: [
            "dashboard",
            "overview",
            "tim-today",
            "headline",
            departmentIdNumber,
        ],
        queryFn: () => fetchTimTodaySnapshot(departmentIdNumber),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const { data: timBotSnapshot, isLoading: isTimBotLoading } = useQuery({
        queryKey: [
            "dashboard",
            "overview",
            "tim-bot",
            "headline",
            departmentIdNumber,
        ],
        queryFn: () => fetchTimBotSnapshot(departmentIdNumber),
        refetchInterval: 5_000,
        refetchIntervalInBackground: true,
        staleTime: 0,
    });

    const isLoading =
        isHeadcountLoading ||
        isProductionLineLoading ||
        isOutstandingQueriesLoading ||
        isForecastLoading ||
        isTimTodayLoading ||
        isTimBotLoading;

    const headcountValue = isLoading
        ? "..."
        : new Intl.NumberFormat().format(headcountToday?.online_count ?? 0);

    const productionLineValue = isLoading
        ? "..."
        : `${productionLineToday?.oldest_queued_days ?? 0} day(s)`;

    const outstandingQueriesValue = isLoading
        ? "..."
        : new Intl.NumberFormat().format(
              outstandingQueries?.query_activities_count ?? 0,
          );

    const forecastValue = isLoading
        ? "..."
        : `${Number(forecastSnapshot?.projected_days ?? 0).toFixed(2)} day(s)`;

    const timTodayValue = isLoading
        ? "..."
        : timTodaySnapshot?.headline_aht ?? "00:00:00";

    const timBotValue = isLoading
        ? "..."
        : timBotSnapshot?.headline_aht ?? "00:00:00";

    return {
        headcountValue,
        productionLineValue,
        outstandingQueriesValue,
        forecastValue,
        timTodayValue,
        timBotValue,
    };
}
