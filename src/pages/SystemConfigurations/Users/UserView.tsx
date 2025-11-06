import { Payment } from "@/types/payment";
import { DataTable } from "@/components/ui/DataTable";
import { useNavigate } from "react-router";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Button } from "@/components/ui/button";
import { getUserHeaders } from "@/data/UserHeaders";
import { useQuery } from "@tanstack/react-query";
import { fetchUserList } from "@/database/user";
import Spinner from "@/components/ui/spinner/Spinner";

export default function UserView() {
    const navigate = useNavigate();
    const columns = getUserHeaders(navigate);

    const {
        data: userData,
        isLoading,
        // error,
        refetch,
    } = useQuery({
        queryKey: ["user-data"],
        queryFn: async () => {
            return await fetchUserList();
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: true,
        staleTime: 500,
        gcTime: 20000,
    });

    console.log(userData);

    return (
        <>
            <PageBreadcrumb pageTitle="Users" />
            <div className="w-full">
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                Users
                            </h3>
                            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
                                List of all Users and their
                                details.
                            </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Button size="sm" onClick={() => navigate("/users/new")}>
                                Add New User
                            </Button>
                        </div>
                    </div>

                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && userData ? (
                                <DataTable columns={columns} data={userData} />
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
