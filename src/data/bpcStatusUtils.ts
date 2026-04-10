import { IBPCStatus } from "@/types/BPCStatusSchema";

type StatusLike = Pick<IBPCStatus, "id" | "wfm" | "status">;

function isUnavailableStatus(status: StatusLike): boolean {
    return status.wfm !== true;
}

export function getBpcSelectableStatusOptions(
    statuses: StatusLike[],
    currentStatusId: string | number | null | undefined,
) {
    const currentId = Number(currentStatusId);
    const disableReady = [2, 3, 4].includes(currentId);

    return statuses
        .filter((status) => {
            if (typeof status.id !== "number") return false;

            if (status.id === 2) return true;

            return isUnavailableStatus(status) && status.id !== 3 && status.id !== 4;
        })
        .map((status) => ({
            value: String(status.id),
            label: status.status,
            disabled: status.id === 2 ? disableReady : false,
        }));
}

export function getBpcStatusColorHex(status?: StatusLike | null) {
    const id = Number(status?.id ?? Number.NaN);

    switch (id) {
        case 2:
            return "#00B050";
        case 3:
            return "#00B0F0";
        case 4:
            return "#002060";
        default:
            return status && isUnavailableStatus(status) ? "#FF0000" : undefined;
    }
}

export function getBpcTimerStatusColumn(
    statusId: number | null | undefined,
    statuses?: StatusLike[] | null,
) {
    const id = Number(statusId ?? Number.NaN);
    if (!Number.isFinite(id)) return null;

    switch (id) {
        case 2:
            return "total_ready_seconds";
        case 3:
            return "total_processing_seconds";
        case 4:
            return "total_wrapup_seconds";
        default: {
            const selectedStatus = statuses?.find((status) => Number(status.id) === id);
            return selectedStatus && isUnavailableStatus(selectedStatus)
                ? "total_break_seconds"
                : null;
        }
    }
}