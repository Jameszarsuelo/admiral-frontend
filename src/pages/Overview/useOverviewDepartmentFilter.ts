import { fetchDepartmentList } from "@/database/department_api";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useOverviewDepartmentFilter() {
    const [searchParams, setSearchParams] = useSearchParams();

    const departmentId = searchParams.get("department_id") ?? "all";
    const departmentIdNumber =
        departmentId !== "all" && Number.isFinite(Number(departmentId))
            ? Number(departmentId)
            : undefined;

    const { data: departments = [] } = useQuery({
        queryKey: ["departments", "list"],
        queryFn: fetchDepartmentList,
        staleTime: 300_000,
    });

    const departmentOptions = useMemo(
        () => [
            { value: "all", label: "All" },
            ...departments.map((department) => ({
                value: String(department.id ?? ""),
                label: department.department,
            })),
        ],
        [departments],
    );

    const setDepartmentId = (value: string) => {
        const next = new URLSearchParams(searchParams);
        if (!value || value === "all") {
            next.delete("department_id");
        } else {
            next.set("department_id", value);
        }
        setSearchParams(next);
    };

    const withDepartmentQuery = (path: string) => {
        if (!departmentIdNumber) {
            return path;
        }

        const separator = path.includes("?") ? "&" : "?";
        return `${path}${separator}department_id=${departmentIdNumber}`;
    };

    return {
        departmentId,
        departmentIdNumber,
        departmentOptions,
        setDepartmentId,
        withDepartmentQuery,
    };
}
