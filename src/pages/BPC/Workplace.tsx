import { fetchBpcStatusList } from "@/database/bpc_status_api";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { User2Icon } from "lucide-react";
import Select from "@/components/form/Select";
import { useMemo, useState, useEffect } from "react";
import { IBPCStatus } from "@/types/BPCStatusSchema";
import { fetchBpcByUserId } from "@/database/bpc_api";
import { IBPCSchema } from "@/types/BPCSchema";
import { echo } from "@/lib/echo";

export default function Workplace() {
    const { user } = useAuth();

    const { data: bpcStatusData } = useQuery({
        queryKey: ["bpc-status-list"],
        queryFn: async () => {
            return await fetchBpcStatusList();
        },
    });

    const { data: bpcUser } = useQuery({
        queryKey: ["bpc-data"],
        queryFn: async () => {
            return await fetchBpcByUserId(user!.id);
        },
        enabled: !!user,
    });

    const statusOptions = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        return list.map((s) => ({
            value: String(s.id),
            label: s.status,
        }));
    }, [bpcStatusData]);

    const [selectedStatusId, setSelectedStatusId] = useState<string>("");
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    useEffect(() => {
        if (!bpcUser) return;
        const bpcUserData = bpcUser as IBPCSchema as {
            bpc_status_id?: number;
            status_id?: number;
        };
        const statusId =
            bpcUserData.bpc_status_id ?? bpcUserData.status_id ?? "";
        setSelectedStatusId(String(statusId));
    }, [bpcUser]);

    const selectedStatus = useMemo(() => {
        const list = (bpcStatusData || []) as IBPCStatus[];
        return list.find((s) => String(s.id) === selectedStatusId);
    }, [bpcStatusData, selectedStatusId]);

    useEffect(() => {
        echo.connector.pusher.connection.bind("connected", () => {
            console.log("Pusher connected!");
        });
        
        echo.private("testing").listen(".TestBroadcast", (data: string) => {
            console.log("Received from Laravel:", data);
        });
    }, []);

    return (
        <>
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-10 xl:col-span-10">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-6">
                        <div className="rounded-2xl overflow-hidden shadow-md">
                            <div className=" text-black px-6 py-6 sm:px-8 sm:py-8">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-black/20 flex items-center justify-center">
                                            <User2Icon className="w-7 h-7 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-sm opacity-90">
                                                Bordereau Payment Clerk
                                                Information
                                            </div>
                                            <div className="mt-1 text-4xl font-extrabold tracking-tight">
                                                {user?.firstname}{" "}
                                                {user?.lastname}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className="text-xs opacity-90">
                                            Email Address
                                        </div>
                                        <div className="mt-1 text-sm font-medium">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-gray-900 px-6 py-5 sm:px-8 sm:py-6">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">{/*  */}</div>

                                    <div className="hidden md:flex flex-col items-end">
                                        <div className="flex items-center gap-2">
                                            <span
                                                className={`inline-block w-3 h-3 rounded-full ${
                                                    selectedStatus &&
                                                    selectedStatus.wfm
                                                        ? "bg-emerald-500"
                                                        : "bg-gray-300"
                                                }`}
                                            />
                                            <div className="ml-2 text-sm font-medium">
                                                {selectedStatus
                                                    ? selectedStatus.status
                                                    : "Unknown"}
                                            </div>
                                        </div>

                                        <div className="mt-3 w-48">
                                            <Select
                                                options={statusOptions}
                                                placeholder={
                                                    selectedStatus
                                                        ? selectedStatus.status
                                                        : "Change status"
                                                }
                                                value={selectedStatusId}
                                                className={
                                                    isUpdatingStatus
                                                        ? "opacity-60 pointer-events-none"
                                                        : ""
                                                }
                                                onChange={async (
                                                    val: string,
                                                ) => {
                                                    setSelectedStatusId(val);
                                                    setIsUpdatingStatus(true);
                                                    // TODO: persist change to backend. Example API call:
                                                    // await api.post(`/bpc/${user?.id}/status`, { status_id: Number(val) })
                                                    console.log(
                                                        "Status change requested",
                                                        {
                                                            user_id: user?.id,
                                                            status_id:
                                                                Number(val),
                                                        },
                                                    );
                                                    setTimeout(
                                                        () =>
                                                            setIsUpdatingStatus(
                                                                false,
                                                            ),
                                                        600,
                                                    );
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="col-span-12 xl:col-span-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <EcommerceMetrics
                            label="Invoices Queries"
                            value="234"
                        />
                        <EcommerceMetrics
                            label="Approaching Deadline"
                            value="87"
                        />
                        <EcommerceMetrics label="Tasks in Progress" value="7" />
                        <EcommerceMetrics label="Tasks Overdue" value="2" />
                    </div>
                </div>

                <div className="col-span-12">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                        <RecentOrders />
                        <RecentOrders />
                    </div>
                </div> */}
            </div>
        </>
    );
}
