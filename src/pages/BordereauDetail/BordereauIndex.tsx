import { useNavigate } from "react-router";
import { useEffect, useState, type MouseEvent } from "react";
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
import { IBordereauIndex } from "@/types/BordereauSchema";
import Alert from "@/components/ui/alert/Alert";
import { fetchBpcOptions } from "@/database/bpc_api";
import api from "@/database/api";
import { Field } from "@/components/ui/field";
import Combobox from "@/components/form/Combobox";
import Input from "@/components/form/input/InputField";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function BordereauIndex() {
    const navigate = useNavigate();
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
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
        supplier_id?: string;
        bordereau?: string;
    }>({
        defaultValues: {
            document: undefined,
            admiral_invoice_type: "",
            supplier_id: "",
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
    } = useForm<{ reason?: string; notes?: string }>({
        defaultValues: { reason: "", notes: "" },
    });
    const [isUploading, setIsUploading] = useState(false);

    const {
        data: bordereauData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["invoice-data"],
        queryFn: async () => {
            return await fetchBordereauList();
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
        // staleTime: 500,
        // gcTime: 20000,
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

    useEffect(() => {
        if (bordereauData) {
            const selected = bordereauData.data.filter(
                (b) => b.id === activeId,
            );
            setBordereauSelected(selected[0]);
        }
    }, [bordereauData, activeId]);

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
                                    { key: "Overdue", label: "Overdue" },
                                    {
                                        key: "MaxPayment",
                                        label: "Max Payment Day Tomorrow",
                                        value: bordereauData?.overdueCount
                                    },
                                    {
                                        key: "TargetDay",
                                        label: "Target Day Tomorrow",
                                        value: bordereauData?.targetdateCount
                                    },
                                    {
                                        key: "OverdueMaxPaymentTargetWorkload",
                                        label: "Overdue / MaxPayment / TargetWorkload",
                                    },
                                    { key: "Queued", label: "Queued", value: bordereauData?.queuedCount },
                                    {
                                        key: "In Progress",
                                        label: "In Progress",
                                        value: bordereauData?.inProgressCount
                                    },
                                    { key: "Query", label: "Query", value: bordereauData?.queryCount },
                                    {
                                        key: "QueuedWorkload",
                                        label: "Queued Workload",
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
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-Select Invoice Status-",
                                                    },
                                                    {
                                                        value: "in_progress",
                                                        label: "In Progress",
                                                    },
                                                    {
                                                        value: "queued",
                                                        label: "Queued",
                                                    },
                                                    {
                                                        value: "query",
                                                        label: "Query",
                                                    },
                                                    {
                                                        value: "closed",
                                                        label: "Closed (Paid)",
                                                    },
                                                ]}
                                                value={""}
                                                onChange={() => {}}
                                                placeholder="-Select Invoice Status-"
                                            />
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <Label htmlFor="filter-supplier">
                                                Supplier
                                            </Label>
                                            <Select
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-Select Supplier-",
                                                    },
                                                    {
                                                        value: "supplier_a",
                                                        label: "Supplier A",
                                                    },
                                                    {
                                                        value: "supplier_b",
                                                        label: "Supplier B",
                                                    },
                                                ]}
                                                value={""}
                                                onChange={() => {}}
                                                placeholder="-Select Supplier-"
                                            />
                                        </div>
                                        <div className="col-span-12 space-y-6 xl:col-span-4">
                                            <Label htmlFor="bpc">
                                                Bordereau Processing Clerk
                                            </Label>
                                            <Select
                                                options={[
                                                    {
                                                        value: "",
                                                        label: "-Select BPC-",
                                                    },
                                                    {
                                                        value: "bpc_a",
                                                        label: "BPC A",
                                                    },
                                                    {
                                                        value: "bpc_b",
                                                        label: "BPC B",
                                                    },
                                                ]}
                                                value={""}
                                                onChange={() => {}}
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
                                            <RadioGroup defaultValue="initial-upload">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="initial-upload"
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
                                                        value="overdue"
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
                                            <RadioGroup defaultValue="queued">
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
                                <Button size="sm">Filter</Button>
                                <Button size="sm" variant="outline">
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
                    onClose={() => setIsCsvModalOpen(false)}
                    className="max-w-3xl mx-4"
                >
                    <div className="p-6 md:p-8">
                        <h3 className="text-lg font-semibold">
                            Upload Invoices CSV
                        </h3>
                        <p className="text-sm text-gray-600 mt-2">
                            Upload a CSV file containing invoices — the file
                            will be processed and invoices will be created.
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
                                        // refetch invoice list
                                        try {
                                            await refetch?.();
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
                                    name="bordereau"
                                    control={csvControl}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label htmlFor="bordereau">
                                                Bordereau
                                            </Label>
                                            <Input
                                                {...field}
                                                id="bordereau"
                                                placeholder="Enter Bordereau"
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
                                        <div>
                                            <Label>Reason</Label>
                                            <select
                                                {...field}
                                                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-800 dark:border-slate-700"
                                            >
                                                <option value="">
                                                    Select reason
                                                </option>
                                                <option value="force">
                                                    Force Process
                                                </option>
                                                <option value="urgent">
                                                    Urgent
                                                </option>
                                                <option value="retry">
                                                    Retry
                                                </option>
                                            </select>
                                        </div>
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
                                    name="reason"
                                    control={closeControl}
                                    rules={{ required: "Reason is required" }}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            data-invalid={fieldState.invalid}
                                        >
                                            <Label>Reason</Label>
                                            <select
                                                {...field}
                                                className="mt-1 block w-full rounded-md border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-800 dark:border-slate-700"
                                            >
                                                <option value="">
                                                    Select reason
                                                </option>
                                                <option value="wrong_contact">
                                                    Wrong Contact Details
                                                </option>
                                                <option value="duplicate">
                                                    Duplicate
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>
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
                                                await api.post(
                                                    `/bordereau/close`,
                                                    {
                                                        bordereau_id:
                                                            bordereauSelected.id,
                                                        reason:
                                                            data.reason ?? null,
                                                        notes:
                                                            data.notes ?? null,
                                                    },
                                                );
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
