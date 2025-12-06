import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchBpcTimerToday } from "@/database/bpc_api";
import { echo } from "@/lib/echo";
import { TimerSegmentToday } from "@/types/TimerSegment";

// type TimerRow = {
//     id: number;
//     bpc_id: number;
//     status_id: number;
//     started_at: string;
//     ended_at?: string | null;
//     duration_seconds?: number | null;
// };

export default function useBpcTimer(
    bpcId?: number | null,
    selectedStatusId?: string | number | null,
) {
    const { data: timerData, refetch } = useQuery({
        queryKey: ["bpc-timer", bpcId],
        queryFn: async () => {
            if (!bpcId) return null;
            return await fetchBpcTimerToday(bpcId);
        },
        enabled: !!bpcId,
        staleTime: 1000 * 5,
        refetchOnWindowFocus: false,
    });

    const [tick, setTick] = useState(0);
    useEffect(() => {
        const id = window.setInterval(
            () => setTick((t) => t + 1),
            1000,
        ) as unknown as number;
        return () => clearInterval(id);
    }, []);

    console.log(tick);

    useEffect(() => {
        if (!bpcId) return;
        const channel = `timer.bpc.${bpcId}`;

        const onStarted = () => refetch();
        const onStopped = () => refetch();

        try {
            echo.channel(channel).listen(".TimerStarted", onStarted);
            echo.channel(channel).listen(".TimerStopped", onStopped);
        } catch {
            // ignore
        }

        return () => {
            try {
                echo.leave(channel);
            } catch (e) {
                console.log("Error leaving channel:", e);
            }
        };
    }, [bpcId, refetch]);

    const openSegment = (timerData as TimerSegmentToday)?.open ?? null;

    const openDurationSeconds = openSegment
        ? Math.max(
              0,
              Math.floor(
                  (Date.now() - Date.parse(openSegment.started_at)) / 1000,
              ),
          )
        : 0;

    const daily = (timerData as TimerSegmentToday)?.daily ?? null;

    const totalDailySeconds = daily
        ? Number(daily.total_ready_seconds || 0) +
          Number(daily.total_processing_seconds || 0) +
          Number(daily.total_wrapup_seconds || 0) +
          Number(daily.total_break_seconds || 0) +
          Number(daily.total_training_seconds || 0) +
          Number(daily.total_lunch_seconds || 0)
        : 0;

    const statusCol = (id: number | null | undefined) => {
        switch (id) {
            case 2:
                return "total_ready_seconds";
            case 3:
                return "total_processing_seconds";
            case 4:
                return "total_wrapup_seconds";
            case 5:
                return "total_break_seconds";
            case 6:
                return "total_training_seconds";
            case 7:
                return "total_lunch_seconds";
            default:
                return null;
        }
    };

    const prevSecondsForSelectedStatus = (() => {
        const id = Number(selectedStatusId ?? NaN);
        if (Number.isNaN(id) || !daily) return 0;
        const col = statusCol(id);
        if (!col) return 0;
        return Number(daily[col] || 0);
    })();

    const currentStatusSeconds =
        prevSecondsForSelectedStatus +
        (openSegment &&
        Number(openSegment.status_id) === Number(selectedStatusId)
            ? openDurationSeconds
            : 0);

    const totalTodaySeconds = totalDailySeconds + openDurationSeconds;

    const fmt = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return {
            hh: String(h).padStart(2, "0"),
            mm: String(m).padStart(2, "0"),
            ss: String(s).padStart(2, "0"),
        };
    };

    return {
        timerData,
        refetchTimer: refetch,
        openSegment,
        openDurationSeconds,
        prevSecondsForSelectedStatus,
        currentStatusSeconds,
        totalTodaySeconds,
        currentFmt: fmt(currentStatusSeconds),
        totalFmt: fmt(totalTodaySeconds),
    };
}
