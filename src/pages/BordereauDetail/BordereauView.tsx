import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { fetchBordereauById } from "@/database/bordereau_api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import BordereauDetailsView from "./BordereauDetailsView";

export default function BordereauView() {
    const { id } = useParams();

    const { data: bordereauDetail, isLoading } = useQuery({
        queryKey: ["bordereauDetail"],
        queryFn: async () => {
            return await fetchBordereauById(id as unknown as number);
        },
    });

    console.log(bordereauDetail);

    return (
        <>
            <PageBreadcrumb
                pageTitle="View Bordereau Detail"
                pageBreadcrumbs={[{ title: "Bordereau Detail", link: "/bordereau-detail" }]}
            />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Bordereau Details
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                Detailed view of the selected bordereau entry.
                            </p>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <BordereauDetailsView isLoading={isLoading} bordereau={bordereauDetail ?? null} />
                    </div>
                </div>
            </div>
        </>
    );
}
