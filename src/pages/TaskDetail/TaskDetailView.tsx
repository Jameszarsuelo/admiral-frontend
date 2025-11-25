import PageBreadcrumb from "@/components/common/PageBreadCrumb";

export default function TaskDetailView () {
    return (
        <>
            <PageBreadcrumb pageTitle="Task Detail" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Task Detail
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all task details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}