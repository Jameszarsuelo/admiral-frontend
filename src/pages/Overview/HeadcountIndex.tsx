import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import Spinner from "@/components/ui/spinner/Spinner";
import { useQuery } from "@tanstack/react-query";
import {
    headcountColumns,
    type HeadcountRow,
} from "@/data/HeadcountHeaders";
import { fetchHeadcountToday } from "@/database/overview_api";
import { useMemo } from "react";
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

    const rows: HeadcountRow[] = data?.rows ?? [];

    return (
        <>
            <PageBreadcrumb
                pageTitle="Headcount"
                pageBreadcrumbs={[{ title: "Overview", link: overviewLink }]}
            />

            <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                    <div className="w-full">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                            Headcount
                        </h3>
                        <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                            List of Bordereau Processing Clerks and their current workload.
                        </p>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto custom-scrollbar">
                    <div className="min-w-[1000px] xl:min-w-full px-2">
                        {!isLoading ? (
                            <DataTable columns={headcountColumns} data={rows} />
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
