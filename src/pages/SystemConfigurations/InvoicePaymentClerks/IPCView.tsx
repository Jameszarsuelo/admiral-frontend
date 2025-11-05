import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { getIPCHeaders } from "@/data/IPCHeaders";
import { fetchIpcList } from "@/database/ipc";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import Button from "@/components/ui/button/Button";

export default function IPCView() {
    const navigate = useNavigate();
    const columns = getIPCHeaders(navigate);

    const {
        data: ipcData,
        isLoading,
        // error,
    } = useQuery({
        queryKey: ["ipc-data"],
        queryFn: async () => {
            return await fetchIpcList();
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: true,
        staleTime: 500,
        gcTime: 20000,
    });

    return (
        <>
            <PageBreadcrumb pageTitle="Invoice Payment Clerk" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Invoice Payment Clerks
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all invoice payment clerks and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button
                                size="sm"
                                onClick={() =>
                                    navigate("/invoice-payment-clerk/new")
                                }
                            >
                                Add New IPC
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && ipcData ? (
                                <DataTable columns={columns} data={ipcData} />
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
