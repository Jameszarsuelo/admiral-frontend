
type BpcDailyActivity = {
    id: number;
    bpc_id: number;
    date: string;
    first_login_at: string | null;
    last_logout_at: string | null;
    total_ready_seconds: number;
    total_processing_seconds: number;
    total_wrapup_seconds: number;
    total_break_seconds: number;
    total_training_seconds: number;
    total_lunch_seconds: number;
    created_at: string;
    updated_at: string;
};

type TimerSegment = {
    id: number;
    status_id: number;
    started_at: string;
    duration_seconds: number;
};

export interface TimerSegmentToday {
    daily: BpcDailyActivity | null;
    open: TimerSegment | null;
}
