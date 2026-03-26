import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import FilterFieldCard from "@/components/common/FilterFieldCard";
import { DataTable } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/spinner/Spinner";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Select from "@/components/form/Select";
import { useQuery } from "@tanstack/react-query";
import {
    headcountColumns,
    type HeadcountRow,
} from "@/data/HeadcountHeaders";
import { fetchHeadcountToday } from "@/database/overview_api";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function HeadcountIndex() {
    const [searchParams] = useSearchParams();
    const departmentIdNumber = useMemo(() => {
        const raw = searchParams.get("department_id");
        return raw && Number.isFinite(Number(raw)) ? Number(raw) : undefined;
    }, [searchParams]);
    const overviewLink = departmentIdNumber
        ? `/overview?department_id=${departmentIdNumber}`
        : "/overview";

    const { data, isLoading } = useQuery({
        queryKey: ["overview", "headcount", "today", "snapshot", departmentIdNumber],
        queryFn: () => fetchHeadcountToday(departmentIdNumber),
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    const rows: HeadcountRow[] = useMemo(
        () => data?.rows ?? [],
        [data?.rows],
    );

    const [includeLoggedOff, setIncludeLoggedOff] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    const statusOptions = useMemo(() => {
        const unique = new Set<string>();
        for (const row of rows) {
            const raw = row.current_status?.trim();
            if (!raw) continue;
            unique.add(raw);
        }
        return Array.from(unique).sort((a, b) => a.localeCompare(b));
    }, [rows]);

    const filteredRows: HeadcountRow[] = useMemo(() => {
        const normalize = (value: string) => value.trim().toLowerCase();

        return rows.filter((row) => {
            const rawStatus = row.current_status ?? "";
            const normalizedStatus = normalize(rawStatus);

            if (
                !includeLoggedOff &&
                (normalizedStatus === "log off" ||
                    normalizedStatus === "logged off")
            ) {
                return false;
            }

            if (statusFilter !== "all") {
                return normalizedStatus === normalize(statusFilter);
            }

            return true;
        });
    }, [rows, includeLoggedOff, statusFilter]);

    return (
        <>
            <PageBreadcrumb
                pageTitle="Headcount"
                pageBreadcrumbs={[{ title: "Overview", link: overviewLink }]}
            />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="mb-6 flex flex-col gap-5 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Headcount
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            List of Bordereau Processing Clerks and their current workload.
                        </p>
                    </div>
                </div>

                <div className="mb-6 grid gap-4 lg:grid-cols-2">
                    <FilterFieldCard
                        label="Include Log Off?"
                        description="Show users who are currently logged off."
                        className="bg-white dark:bg-white/3"
                    >
                        <RadioGroup
                            value={includeLoggedOff ? "yes" : "no"}
                            onValueChange={(value) =>
                                setIncludeLoggedOff(String(value) === "yes")
                            }
                        >
                            <div className="flex flex-wrap items-center gap-4">
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="yes"
                                        id="include-logoff-yes"
                                    />
                                    <Label htmlFor="include-logoff-yes" className="mb-0">
                                        Yes
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        value="no"
                                        id="include-logoff-no"
                                    />
                                    <Label htmlFor="include-logoff-no" className="mb-0">
                                        No
                                    </Label>
                                </div>
                            </div>
                        </RadioGroup>
                    </FilterFieldCard>

                    <FilterFieldCard
                        label="Status"
                        description="Filter the headcount list by current status."
                        className="bg-white dark:bg-white/3"
                    >
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            placeholder="Show All"
                            options={[
                                { value: "all", label: "Show All" },
                                ...statusOptions.map((status) => ({
                                    value: status,
                                    label: status,
                                })),
                            ]}
                        />
                    </FilterFieldCard>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full px-2">
                        {!isLoading ? (
                            <DataTable
                                columns={headcountColumns}
                                data={filteredRows}
                            />
                        ) : (
                            <div className="flex items-center justify-center py-12">
                                <Spinner size="lg" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
