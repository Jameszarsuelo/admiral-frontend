import React, { useEffect, useState, type MouseEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import FileInput from "@/components/form/input/FileInput";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import { getBordeareauHeaders } from "@/data/BordereauHeaders";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
// import { ArrowUpIcon, GroupIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import { ArrowRight } from "lucide-react";
import Can from "@/components/auth/Can";
import {
    fetchBordereauList,
    fetchBordereauValidationViewData,
    fetchBordereauViewData,
    uploadBordereauCsv,
} from "@/database/bordereau_api";
import { fetchDepartmentList } from "@/database/department_api";
import { fetchBordereauTypeList } from "@/database/bordereau_type_api";
import { IBordereauIndex } from "@/types/BordereauSchema";
import Alert from "@/components/ui/alert/Alert";
import { fetchBpcOptions } from "@/database/bpc_api";
import { fetchBordereauStatusesAll } from "@/database/bordereau_status_api";
import api from "@/database/api";
import { fetchReasonOptionsFor } from "@/database/reason_api";
import { fetchOutcomeList } from "@/database/outcome_api";
import { changeBordereauOutcome } from "@/database/bordereau_api";
import { Field } from "@/components/ui/field";
import Combobox from "@/components/form/Combobox";
import Input from "@/components/form/input/InputField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BordereauIndex() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
    const [csvFileInputKey, setCsvFileInputKey] = useState(0);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [bordereauSelected, setBordereauSelected] = useState<IBordereauIndex>(
        {} as IBordereauIndex,
    );
    const [globalModalOpen, setGlobalModalOpen] = useState({
        assignModal: false,
        payNowModal: false,
        closeModal: false,
    });

    const {
        control: csvControl,
        handleSubmit: handleCsvSubmit,
        reset: resetCsv,
    } = useForm<{
        document?: File | null;
        admiral_invoice_type?: string;
        bordereau_type_id?: string;
        supplier_id?: string;
        bordereau_department_id?: string;
        bordereau?: string;
    }>({
        defaultValues: {
            document: undefined,
            admiral_invoice_type: "",
            bordereau_type_id: "",
            supplier_id: "",
            bordereau_department_id: "",
            bordereau: "",
        },
    });

    const {
        control: assignControl,
        handleSubmit: handleAssignSubmit,
        reset: resetAssign,
    } = useForm<{ bpcId?: number | null }>({
        defaultValues: { bpcId: undefined },
    });

    const {
        control: processControl,
        handleSubmit: handleProcessSubmit,
        reset: resetProcess,
    } = useForm<{
        reason?: string;
        bpcId?: number | null;
        instructions?: string;
    }>({
        defaultValues: { reason: "", bpcId: undefined, instructions: "" },
    });

    const {
        control: closeControl,
        handleSubmit: handleCloseSubmit,
        reset: resetClose,
    } = useForm<{ reason?: string; notes?: string; outcome?: number }>({
        defaultValues: { reason: "", notes: "", outcome: 16 },
    });
    const [isUploading, setIsUploading] = useState(false);
    const [processReasonOptions, setProcessReasonOptions] = useState<{ value: number; label: string }[]>([]);
    const [closeReasonOptions, setCloseReasonOptions] = useState<{ value: number; label: string }[]>([]);
    const [closeOutcomeOptions, setCloseOutcomeOptions] = useState<{ value: number; label: string }[]>([]);

    const handleDownloadSampleBordereauCsv = () => {
        // File lives in `frontend/public/files/sample bordereau.csv`
        // and is served by Vite at `/files/sample%20bordereau.csv`.
        const link = document.createElement("a");
        link.href = "/files/sample%20bordereau.csv";
        link.download = "sample bordereau.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const [filters, setFilters] = useState({
        invoice_status: "",
        supplier_id: "",
        bpc_id: "",
        date_from: "",
        date_to: "",
        search: "",
    });

    const [appliedFilters, setAppliedFilters] = useState(filters);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const search = params.get("search")?.trim() ?? "";
        const supplierId = params.get("supplier_id")?.trim() ?? "";

        if (!search && !supplierId) {
            return;
        }

        const nextFilters = {
            invoice_status: "",
            supplier_id: supplierId,
            bpc_id: "",
            date_from: "",
            date_to: "",
            search,
        };

        setFilters(nextFilters);
        setInvoiceStatus("");
        setBordereauStatus("queued");
        setDateType("created_at");
        setAppliedFilters(nextFilters);
    }, [location.search]);

    const {
        data: bordereauData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["invoice-data", appliedFilters],
        queryFn: async () => {
            return await fetchBordereauList(appliedFilters);
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
    });

    const {
        data: bordereauSummary,
        refetch: refetchSummary,
    } = useQuery({
        queryKey: ["bordereau-summary"],
        queryFn: async () => {
            // Keep payload tiny; we only need the counts.
            return await fetchBordereauList({ page: 1, per_page: 1 });
        },
        // Keep the cards fresh without hammering the full table query.
        refetchInterval: 15_000,
        refetchIntervalInBackground: true,
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    console.log(bordereauData);

    const {
        data: bpcData = [],
        // isLoading,
        // // error,
        // refetch,
    } = useQuery({
        queryKey: ["bpc-data"],
        queryFn: async () => {
            return await fetchBpcOptions();
        },
        refetchInterval: 1000 * 60 * 5, // 5 minutes
        refetchIntervalInBackground: true,
        staleTime: 500,
        gcTime: 20000,
    });

    const {
        data: statusData = [],
    } = useQuery({
        queryKey: ["bordereau-statuses"],
        queryFn: async () => {
            return await fetchBordereauStatusesAll();
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
        staleTime: 500,
    });

    const [invoiceStatus, setInvoiceStatus] = useState<string>("");
    const [bordereauStatus, setBordereauStatus] = useState<string>("queued");
    const [dateType, setDateType] = useState<string>("created_at");

    const filteredStatusOptions = React.useMemo(() => {
        const queuedIds = [3, 16, 17, 18];
        const inProgressIds = [5, 6, 7, 8, 15];
        const processedIds = [4, 9, 10, 11, 12, 13, 14];

        let allowed: number[] = [];
        switch (bordereauStatus) {
            case "queued":
                allowed = queuedIds;
                break;
            case "in-progress":
                allowed = inProgressIds;
                break;
            case "processed":
                allowed = processedIds;
                break;
            default:
                allowed = [];
        }

        const mapped = (statusData || [])
            .filter((s: any) => {
                const id = Number(s.id ?? s.value ?? s.key ?? s.slug ?? NaN);
                return allowed.length === 0 ? true : allowed.includes(id);
            })
            .map((s: any) => ({
                value: s.value ?? s.key ?? s.slug ?? String(s.id ?? ""),
                label: s.label ?? s.name ?? s.title ?? String(s),
            }));

        return [{ value: "", label: "-Select Invoice Status-" }].concat(mapped);
    }, [statusData, bordereauStatus]);

    const { data: supplierData } = useQuery({
        queryKey: ["bordereau-view-data"],
        queryFn: async () => {
            const supplierData = await fetchBordereauViewData();
            return supplierData || [];
        },
    });

    const { data: bordereauValidationData } = useQuery({
        queryKey: ["bordereau-validations"],
        queryFn: async () => {
            const bordereauValidations =
                await fetchBordereauValidationViewData();
            return bordereauValidations || [];
        },
    });

    const { data: departmentOptions } = useQuery({
        queryKey: ["departments-options"],
        queryFn: async () => {
            const departments = await fetchDepartmentList();
            return (departments || []).map((d: any) => ({
                value: Number(d.id),
                label: String(d.department ?? d.name ?? ""),
            }));
        },
    });

    const { data: bordereauTypeOptions } = useQuery({
        queryKey: ["bordereau-types-options"],
        queryFn: async () => {
            const types = await fetchBordereauTypeList();
            return (types || []).map((t: any) => ({
                value: Number(t.id),
                label: String(t.bordereau_type ?? t.name ?? ""),
            }));
        },
    });

    useEffect(() => {
        if (bordereauData) {
            const selected = bordereauData.data.filter(
                (b) => b.id === activeId,
            );
            setBordereauSelected(selected[0]);
        }
    }, [bordereauData, activeId]);

    useEffect(() => {
        async function loadReasonOptions() {
            try {
                const pOpts = await fetchReasonOptionsFor(1); // reason_for = 1 for process
                setProcessReasonOptions(pOpts);
            } catch (err) {
                console.warn("Failed to load process reason options", err);
            }

            try {
                const cOpts = await fetchReasonOptionsFor(2); // reason_for = 2 for close
                setCloseReasonOptions(cOpts);
            } catch (err) {
                console.warn("Failed to load close reason options", err);
            }
        }
        loadReasonOptions();
    }, []);

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const list = await fetchOutcomeList();
                if (!mounted) return;
                const opts = (list || [])
                    .filter((o: any) => typeof o.id === "number")
                    .map((o: any) => ({ value: o.id, label: o.outcome_code ?? o.description ?? String(o.id) }));
                setCloseOutcomeOptions(opts);
            } catch (err) {
                console.warn("Failed to load close outcome options", err);
            }
        })();

        return () => {
            mounted = false;
        };
    }, []);

    const columns = getBordeareauHeaders();

    const handleTableAction = (e: MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const btn = target.closest("button[data-action]") as HTMLElement | null;
        if (!btn) return;

        const action = btn.dataset.action;
        const idStr = btn.dataset.id;
        const id = idStr ? Number(idStr) : undefined;

        if (!action || !id) return;

        switch (action) {
            case "view":
                navigate(`/bordereau-detail/view/${id}`);
                break;
            case "assign":
                setActiveId(id);
                setGlobalModalOpen((prev) => ({
                    ...prev,
                    assignModal: !prev.assignModal,
                }));
                break;
            case "process":
                setActiveId(id);
                setGlobalModalOpen((prev) => ({
                    ...prev,
                    payNowModal: !prev.payNowModal,
                }));
                break;
            case "close":
                setActiveId(id);
                // reset close form to default values (auto-select outcome id 16)
                try {
                    resetClose({ outcome: 16, reason: "", notes: "" });
                } catch (err) {
                    // ignore
                }
                setGlobalModalOpen((prev) => ({
                    ...prev,
                    closeModal: !prev.closeModal,
                }));
                break;
            default:
                break;
        }
    };

    return (
        <>
            <PageBreadcrumb pageTitle="Bordereau Detail" />
            <div className="w-full">
                <div className="grid grid-cols-12 gap-4 md:gap-6">
                    <div className="col-span-12 space-y-6 xl:col-span-9">
                        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 mb-6">
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { key: "Overdue", label: "Overdue", value: bordereauSummary?.overdueCount },
                                    {
                                        key: "MaxPayment",
                                        label: "Max Payment Day Tomorrow",
                                        value: bordereauSummary?.deadlineTomorrowCount,
                                    },
                                    {
                                        key: "TargetDay",
                                        label: "Target Day Tomorrow",
                                        value: bordereauSummary?.targetdateCount,
                                    },
                                    {
                                        key: "OverdueMaxPaymentTargetWorkload",
                                        label: "Overdue / MaxPayment / TargetWorkload",
                                        value:
                                            (bordereauSummary?.overdueCount ?? 0) +
                                            (bordereauSummary?.deadlineTomorrowCount ?? 0) +
                                            (bordereauSummary?.targetdateCount ?? 0),
                                    },
                                    { key: "Queued", label: "Queued", value: bordereauSummary?.queuedCount },
                                    {
                                        key: "In Progress",
                                        label: "In Progress",
                                        value: bordereauSummary?.inProgressCount,
                                    },
                                    { key: "Query", label: "Query", value: bordereauSummary?.queryCount },
                                    {
                                        key: "QueuedWorkload",
                                        label: "Queued Workload",
                                        value: (bordereauSummary?.queuedCount ?? 0) + (bordereauSummary?.inProgressCount ?? 0) + (bordereauSummary?.queryCount ?? 0),
                                    },
                                ].map((s) => (
                                    <div
                                        key={s.key}
                                        className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/3 "
                                    >
                                        <div className="flex items-end justify-between ">
                                            <div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {s.label}
                                                </span>
                                                <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
                                                    {s.value ?? 0}
                                                </h4>
                                            </div>
                                            <Badge color="light">
                                                <ArrowRight />
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-span-12 space-y-6 xl:col-span-3">
                        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 mb-6">
                            <h1 className="text-xl font-bold mb-5">
                                Add Bordereau / Workload
                            </h1>
                            <Can permission="bordereau_detail.create">
                                <Button
                                    className="mb-5 w-full"
                                    size="lg"
                                    variant="outline"
                                    onClick={() => setIsCsvModalOpen(true)}
                                >
                                    Bulk Upload (CSV)
                                </Button>
                            </Can>
                            <Can permission="bordereau_detail.create">
                                <Button
                                    className="mb-5 w-full"
                                    size="lg"
                                    variant="primary"
                                    onClick={() =>
                                        navigate("/bordereau-detail/create")
                                    }
                                >
                                    Add Single Bordereau
                                </Button>
                            </Can>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                {/* Invoice Table Section */}
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/3 sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                List of Bordereau
                            </h3>
                            {/* Filter + Summary Row */}
                            <h3 className="text-md text-gray-800 dark:text-white/90 mt-2">
                                Select Filters, then click on "Filter" to create
                                list
                            </h3>
                            <div className="grid grid-cols-12 gap-4 md:gap-6 my-3">
                                <div className="col-span-12 space-y-6 xl:col-span-9">
                                    <div className="grid grid-cols-12 gap-4 md:gap-6 my-3">
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <Label htmlFor="filter-status">
                                                Invoice Status
                                            </Label>
                                            <Select
                                                options={filteredStatusOptions}
                                                value={invoiceStatus}
                                                onChange={(val: any) => {
                                                    setInvoiceStatus(String(val));
                                                    setFilters((f) => ({
                                                        ...f,
                                                        invoice_status: String(val),
                                                    }));
                                                }}
                                                placeholder="-Select Invoice Status-"
                                            />
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <Label htmlFor="filter-supplier">
                                                Supplier
                                            </Label>
                                            <Select
                                                options={
                                                    [
                                                        {
                                                            value: "",
                                                            label: "-Select Supplier-",
                                                        },
                                                    ].concat(
                                                        (supplierData || []).map(
                                                            (s: any) => ({
                                                                value: s.value ?? s.id ?? String(s.id ?? ""),
                                                                label: s.label ?? s.name ?? String(s),
                                                            }),
                                                        ),
                                                    )
                                                }
                                                value={filters.supplier_id}
                                                onChange={(val: any) =>
                                                    setFilters((f) => ({
                                                        ...f,
                                                        supplier_id: String(val),
                                                    }))
                                                }
                                                placeholder="-Select Supplier-"
                                            />
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <Label htmlFor="bpc">
                                                Bordereau Processing Clerk
                                            </Label>
                                            <Select
                                                options={
                                                    [
                                                        {
                                                            value: "",
                                                            label: "-Select BPC-",
                                                        },
                                                    ].concat(
                                                        (bpcData || []).map((b: any) => ({
                                                            value: String(b.value ?? b.id ?? ""),
                                                            label: String(b.label ?? b.name ?? b),
                                                        })),
                                                    )
                                                }
                                                value={filters.bpc_id}
                                                onChange={(val: any) =>
                                                    setFilters((f) => ({
                                                        ...f,
                                                        bpc_id: String(val),
                                                    }))
                                                }
                                                placeholder="-Select BPC-"
                                            />
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <div>
                                                <Label>Date From</Label>
                                                <DatePicker
                                                    id="filter-date-from"
                                                    placement="top"
                                                    placeholder="Date from"
                                                    defaultDate={filters.date_from || undefined}
                                                    onChange={(_sd: any, dateStr: string) =>
                                                        setFilters((f) => ({
                                                            ...f,
                                                            date_from: dateStr ?? "",
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <div>
                                                <Label>Date To</Label>
                                                <DatePicker
                                                    id="filter-date-to"
                                                    placement="top"
                                                    placeholder="Date to"
                                                    defaultDate={filters.date_to || undefined}
                                                    onChange={(_sd: any, dateStr: string) =>
                                                        setFilters((f) => ({
                                                            ...f,
                                                            date_to: dateStr ?? "",
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-12 space-y-6 xl:col-span-3">
                                    <div className="grid grid-cols-12 gap-4 md:gap-6 my-3">
                                        <div className="col-span-12 space-y-6 xl:col-span-6">
                                            <h3 className="text-md font-semibold mb-4">
                                                Date Type
                                            </h3>
                                            <RadioGroup
                                                value={dateType}
                                                onValueChange={(v) =>
                                                    setDateType(String(v))
                                                }
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="created_at"
                                                        id="initial-upload"
                                                    />
                                                    <Label
                                                        htmlFor="initial-upload"
                                                        className="mb-0"
                                                    >
                                                        Initial Upload
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="target-process-by"
                                                        id="target-process-by"
                                                    />
                                                    <Label
                                                        htmlFor="target-process-by"
                                                        className="mb-0"
                                                    >
                                                        Target Process By
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="max-pay-overdue"
                                                        id="overdue"
                                                    />
                                                    <Label
                                                        htmlFor="overdue"
                                                        className="mb-0"
                                                    >
                                                        Max Pay / Overdue
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-6">
                                            <h3 className="text-md font-semibold mb-4">
                                                Bordereau Status
                                            </h3>
                                            <RadioGroup
                                                value={bordereauStatus}
                                                onValueChange={(v) => {
                                                    setBordereauStatus(String(v));
                                                    setInvoiceStatus("");
                                                }}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="queued"
                                                        id="queued"
                                                    />
                                                    <Label
                                                        htmlFor="queued"
                                                        className="mb-0"
                                                    >
                                                        Queued
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="in-progress"
                                                        id="in-progress"
                                                    />
                                                    <Label
                                                        htmlFor="in-progress"
                                                        className="mb-0"
                                                    >
                                                        In Progress
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="processed"
                                                        id="processed"
                                                    />
                                                    <Label
                                                        htmlFor="processed"
                                                        className="mb-0"
                                                    >
                                                        Processed
                                                    </Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                <div className="mt-4 flex gap-3">
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        const params: Record<string, unknown> = {
                                            ...filters,
                                        };

                                        // If date filters provided, pass backend's `date_type` token
                                        if (filters.date_from || filters.date_to) {
                                            params.date_type = dateType;
                                        }

                                        setAppliedFilters(params as any);
                                    }}
                                >
                                    Filter
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                        const empty = {
                                            invoice_status: "",
                                            supplier_id: "",
                                            bpc_id: "",
                                            date_from: "",
                                            date_to: "",
                                            search: "",
                                        };
                                        setFilters(empty);
                                        setInvoiceStatus("");
                                        setBordereauStatus("queued");
                                        setDateType("created_at");
                                        setAppliedFilters(empty);
                                    }}
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && bordereauData ? (
                                <div
                                    onClick={handleTableAction}
                                    role="presentation"
                                >
                                    <DataTable
                                        columns={columns}
                                        data={bordereauData.data}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* CSV Upload Modal */}
                <Modal
                    isOpen={isCsvModalOpen}
                    onClose={() => {
                        setIsCsvModalOpen(false);
                        // Reset the native file input so reopening the modal doesn't show a stale file.
                        setCsvFileInputKey((k) => k + 1);
                    }}
                    className="max-w-3xl mx-4"
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold">
                            Upload Bordereau CSV
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Upload a CSV containing a supplier bordereau. The file
                            will be imported and individual Bordereau activities created.
                            NOTE: Each upload can only contain Bordereau activities from a single supplier,
                            with a single Work type and a single bordereau type
                        </p>

                        <form
                            className="mt-4"
                            onSubmit={handleCsvSubmit(async (data) => {
                                const file = data.document;
                                if (!file) {
                                    toast.error(
                                        "Please choose a CSV file to upload",
                                    );
                                    return;
                                }

                                try {
                                    setIsUploading(true);
                                    try {
                                        await uploadBordereauCsv(data);
                                        toast.success(
                                            "CSV uploaded successfully",
                                        );
                                        setIsCsvModalOpen(false);
                                        resetCsv();
                                        setCsvFileInputKey((k) => k + 1);
                                        // refetch invoice list
                                        try {
                                            await refetch?.();
                                            await refetchSummary?.();
                                        } catch (err) {
                                            console.warn(
                                                "Refetch after upload failed",
                                                err,
                                            );
                                        }
                                    } catch (err) {
                                        console.error("Upload failed:", err);
                                        toast.error("Upload failed");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error(
                                        "Upload failed (network error)",
                                    );
                                } finally {
                                    setIsUploading(false);
                                }
                            })}
                        >
                            <div className="grid grid-cols-1 gap-6 ">
                                <Controller
                                    name="bordereau_department_id"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="bordereau_department_id">
                                                Department
                                            </Label>
                                            <Combobox
                                                value={field.value ?? ""}
                                                options={departmentOptions || []}
                                                placeholder="Select Department"
                                                searchPlaceholder="Search department..."
                                                onChange={(value) =>
                                                    field.onChange(Number(value))
                                                }
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="supplier_id"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="supplier_id">
                                                Supplier
                                            </Label>
                                            <Combobox
                                                value={field.value ?? ""}
                                                options={supplierData || []}
                                                placeholder="Select Supplier"
                                                searchPlaceholder="Search supplier..."
                                                onChange={(value) =>
                                                    field.onChange(
                                                        Number(value),
                                                    )
                                                }
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="admiral_invoice_type"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="admiral_invoice_type">
                                                Admiral Invoice Type
                                            </Label>
                                            <Combobox
                                                value={field.value ?? ""}
                                                options={
                                                    bordereauValidationData ||
                                                    []
                                                }
                                                placeholder="Select Admiral Invoice Type"
                                                searchPlaceholder="Search types..."
                                                onChange={(value) =>
                                                    field.onChange(
                                                        Number(value),
                                                    )
                                                }
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="bordereau_type_id"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <Label htmlFor="bordereau_type_id">
                                                Bordereau Type
                                            </Label>
                                            <Combobox
                                                value={field.value ?? ""}
                                                options={bordereauTypeOptions || []}
                                                placeholder="Select Bordereau Type"
                                                searchPlaceholder="Search bordereau types..."
                                                onChange={(value) =>
                                                    field.onChange(Number(value))
                                                }
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="bordereau"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="bordereau">
                                                Bordereau Name
                                            </Label>
                                            <Input
                                                {...field}
                                                id="bordereau"
                                                placeholder="Enter Bordereau Name"
                                                value={field.value ?? ""}
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="document"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <div>
                                            <Label>Upload a file</Label>
                                            <FileInput
                                                key={csvFileInputKey}
                                                onChange={(e) => {
                                                    const file =
                                                        e.target.files?.[0];
                                                    if (file)
                                                        field.onChange(file);
                                                }}
                                                className="mt-2"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <div className="flex w-full items-center justify-between gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={handleDownloadSampleBordereauCsv}
                                        disabled={isUploading}
                                    >
                                        Download Sample CSV
                                    </Button>

                                    <div className="flex items-center justify-end gap-3">
                                        <Button
                                            variant="danger"
                                            onClick={() => {
                                                setIsCsvModalOpen(false);
                                                resetCsv();
                                            }}
                                            disabled={isUploading}
                                        >
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isUploading}>
                                            {isUploading ? "Uploading..." : "Upload"}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal
                    isOpen={globalModalOpen.assignModal}
                    onClose={() =>
                        setGlobalModalOpen((prev) => ({
                            ...prev,
                            assignModal: !prev.assignModal,
                        }))
                    }
                    className="max-w-3xl mx-4"
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold mb-5">
                            (Re)Assign BPC
                        </h3>

                        <Alert
                            variant="info"
                            title="Current BPC"
                            message={
                                bordereauSelected?.bpc
                                    ? String(
                                          bordereauSelected?.bpc?.contact
                                              .firstname +
                                              " " +
                                              bordereauSelected?.bpc?.contact
                                                  .lastname,
                                      )
                                    : "No BPC Assigned"
                            }
                            showLink={false}
                        />

                        <form className="mt-4">
                            <Controller
                                name="bpcId"
                                control={assignControl}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <Label htmlFor="bpcId">
                                            BPC to Assign
                                        </Label>
                                        <div className="flex gap-2 w-full">
                                            <div className="flex-1">
                                                <Combobox
                                                    value={field.value ?? ""}
                                                    options={bpcData}
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                    placeholder="Select BPC..."
                                                    searchPlaceholder="Search BPC..."
                                                    emptyText="No BPC found."
                                                />
                                            </div>
                                        </div>
                                        {fieldState.error && (
                                            <p className="mt-1 text-sm text-error-500">
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </Field>
                                )}
                            />
                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setGlobalModalOpen((prev) => ({
                                            ...prev,
                                            assignModal: !prev.assignModal,
                                        }));
                                        resetAssign();
                                    }}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleAssignSubmit(async (data) => {
                                            try {
                                                setIsUploading(true);
                                                // PATCH bpc_id on the bordereau record
                                                await api.post(
                                                    `/update-bordereau-bpc`,
                                                    {
                                                        bpc_id: data.bpcId,
                                                        bordereau_id:
                                                            bordereauSelected.id,
                                                    },
                                                );
                                                toast.success("BPC assigned");
                                                setGlobalModalOpen((prev) => ({
                                                    ...prev,
                                                    assignModal:
                                                        !prev.assignModal,
                                                }));
                                                resetAssign();
                                                try {
                                                    await refetch?.();
                                                    await refetchSummary?.();
                                                } catch (err) {
                                                    console.warn(
                                                        "Refetch after assign failed",
                                                        err,
                                                    );
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                toast.error(
                                                    "Failed to assign BPC",
                                                );
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        })()
                                    }
                                    disabled={isUploading}
                                >
                                    {isUploading
                                        ? "Changing BPC..."
                                        : "Change BPC"}
                                </Button>
                            </div>
                        </form>
                        {/* </form> */}
                    </div>
                </Modal>

                <Modal
                    isOpen={globalModalOpen.payNowModal}
                    onClose={() =>
                        setGlobalModalOpen((prev) => ({
                            ...prev,
                            payNowModal: !prev.payNowModal,
                        }))
                    }
                    className="max-w-3xl mx-4"
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold">
                            Process Next (Will Force this Bordereau to Top of
                            Queue)
                        </h3>
                        <form className="mt-6">
                            <div className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="reason"
                                    control={processControl}
                                    render={({ field }) => (
                                        <Field>
                                            <Label>Reason</Label>
                                            <Select
                                                options={
                                                    [
                                                        { value: "", label: "- Select Reason -" },
                                                    ].concat(
                                                        processReasonOptions.map((o) => ({ value: String(o.value), label: o.label })),
                                                    )
                                                }
                                                value={String(field.value ?? "")}
                                                onChange={(val: any) => field.onChange(Number(val))}
                                                placeholder="Select Reason"
                                            />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="bpcId"
                                    control={processControl}
                                    render={({ field }) => (
                                        <Field>
                                            <Label>Assign BPC</Label>
                                            <div className="mt-1">
                                                <Combobox
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    options={bpcData}
                                                    onChange={(value) =>
                                                        field.onChange(
                                                            Number(value),
                                                        )
                                                    }
                                                    placeholder="Select BPC..."
                                                    searchPlaceholder="Search BPC..."
                                                    emptyText="No BPC found."
                                                />
                                            </div>
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="instructions"
                                    control={processControl}
                                    render={({ field }) => (
                                        <div>
                                            <Label>Instructions</Label>
                                            <textarea
                                                {...field}
                                                rows={6}
                                                className="mt-1 w-full rounded-md border border-gray-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700"
                                                placeholder="Write Instructions for BPC Here"
                                            />
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setGlobalModalOpen((prev) => ({
                                            ...prev,
                                            payNowModal: !prev.payNowModal,
                                        }));
                                        resetProcess();
                                    }}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleProcessSubmit(async (data) => {
                                            if (!bordereauSelected?.id) {
                                                toast.error(
                                                    "No bordereau selected",
                                                );
                                                return;
                                            }
                                            try {
                                                setIsUploading(true);
                                                // POST process request (updates bpc and queues processing)
                                                await api.post(
                                                    `/bordereau/process`,
                                                    {
                                                        bordereau_id:
                                                            bordereauSelected.id,
                                                        bpc_id:
                                                            data.bpcId ?? null,
                                                        reason:
                                                            data.reason ?? null,
                                                        instructions:
                                                            data.instructions ??
                                                            null,
                                                    },
                                                );
                                                toast.success(
                                                    "Bordereau queued for processing",
                                                );
                                                setGlobalModalOpen((prev) => ({
                                                    ...prev,
                                                    payNowModal:
                                                        !prev.payNowModal,
                                                }));
                                                resetProcess();
                                                try {
                                                    await refetch?.();
                                                    await refetchSummary?.();
                                                } catch (err) {
                                                    console.warn(
                                                        "Refetch after process failed",
                                                        err,
                                                    );
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                toast.error(
                                                    "Failed to queue bordereau",
                                                );
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        })()
                                    }
                                    disabled={isUploading}
                                >
                                    {isUploading
                                        ? "Processing..."
                                        : "Process Now"}
                                </Button>
                            </div>
                        </form>
                        {/* </form> */}
                    </div>
                </Modal>

                <Modal
                    isOpen={globalModalOpen.closeModal}
                    onClose={() =>
                        setGlobalModalOpen((prev) => ({
                            ...prev,
                            closeModal: !prev.closeModal,
                        }))
                    }
                    className="max-w-3xl mx-4"
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold">
                            Close Bordereau
                        </h3>

                        <form className="mt-6">
                            <div className="grid grid-cols-1 gap-4">
                                <Controller
                                    name="outcome"
                                    control={closeControl}
                                    render={({ field }) => (
                                        <Field>
                                            <Label>Outcome</Label>
                                            <Select
                                                options={
                                                    [
                                                        { value: "", label: "- Select Outcome -" },
                                                    ].concat(
                                                        closeOutcomeOptions.map((o) => ({ value: String(o.value), label: o.label })),
                                                    )
                                                }
                                                value={String(field.value ?? "")}
                                                onChange={(val: any) => field.onChange(Number(val))}
                                                placeholder="Select Outcome"
                                            />
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="reason"
                                    control={closeControl}
                                    rules={{ required: "Reason is required" }}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label>Reason</Label>
                                            <Select
                                                options={
                                                    [
                                                        { value: "", label: "- Select Reason -" },
                                                    ].concat(
                                                        closeReasonOptions.map((o) => ({ value: String(o.value), label: o.label })),
                                                    )
                                                }
                                                value={String(field.value ?? "")}
                                                onChange={(val: any) => field.onChange(Number(val))}
                                                placeholder="Select Reason"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="notes"
                                    control={closeControl}
                                    rules={{ required: "Notes are required" }}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label>Notes</Label>
                                            <textarea
                                                {...field}
                                                rows={6}
                                                className="mt-1 w-full rounded-md border border-gray-200 p-3 text-sm dark:bg-slate-800 dark:border-slate-700"
                                                placeholder="Enter Notes"
                                            />
                                            {fieldState.error && (
                                                <p className="mt-1 text-sm text-error-500">
                                                    {fieldState.error.message}
                                                </p>
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <Button
                                    variant="danger"
                                    onClick={() => {
                                        setGlobalModalOpen((prev) => ({
                                            ...prev,
                                            closeModal: !prev.closeModal,
                                        }));
                                        resetClose();
                                    }}
                                    disabled={isUploading}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={() =>
                                        handleCloseSubmit(async (data) => {
                                            if (!bordereauSelected?.id) {
                                                toast.error(
                                                    "No bordereau selected",
                                                );
                                                return;
                                            }
                                            try {
                                                setIsUploading(true);
                                                // If an outcome was selected, submit it using same approach as Workplace
                                                if (data.outcome) {
                                                    try {
                                                        await changeBordereauOutcome(
                                                            bordereauSelected.id,
                                                            Number(data.outcome),
                                                        );
                                                    } catch (err) {
                                                        console.warn(
                                                            "Failed to set outcome before close",
                                                            err,
                                                        );
                                                    }
                                                }

                                                await api.post(`/bordereau/close`, {
                                                    bordereau_id: bordereauSelected.id,
                                                    reason: data.reason ?? null,
                                                    notes: data.notes ?? null,
                                                });
                                                toast.success(
                                                    "Bordereau closed",
                                                );
                                                setGlobalModalOpen((prev) => ({
                                                    ...prev,
                                                    closeModal:
                                                        !prev.closeModal,
                                                }));
                                                resetClose();
                                                try {
                                                    await refetch?.();
                                                    await refetchSummary?.();
                                                } catch (err) {
                                                    console.warn(
                                                        "Refetch after close failed",
                                                        err,
                                                    );
                                                }
                                            } catch (err) {
                                                console.error(err);
                                                toast.error(
                                                    "Failed to close bordereau",
                                                );
                                            } finally {
                                                setIsUploading(false);
                                            }
                                        })()
                                    }
                                    disabled={isUploading}
                                >
                                    {isUploading
                                        ? "Closing..."
                                        : "Close Bordereau"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
        </>
    );
}
