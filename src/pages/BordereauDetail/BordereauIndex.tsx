import { useNavigate } from "react-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Modal } from "@/components/ui/modal";
import FileInput from "@/components/form/input/FileInput";
import { toast } from "sonner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { DataTable } from "@/components/ui/DataTable";
import Button from "@/components/ui/button/Button";
import { getInvoiceHeaders } from "@/data/InvoiceHeaders";
import { fetchInvoiceList, uploadInvoiceCsv } from "@/database/invoice_api";
import { useQuery } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner/Spinner";
import Select from "@/components/form/Select";
import DatePicker from "@/components/form/date-picker";
import Label from "@/components/form/Label";
import { ArrowUpIcon, GroupIcon } from "@/icons";
import Badge from "@/components/ui/badge/Badge";
import { ArrowRight } from "lucide-react";
import Can from "@/components/auth/Can";

export default function BordereauIndex() {
    const navigate = useNavigate();
    // const columns = getInvoiceHeaders();
    const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

    const {
        control: csvControl,
        handleSubmit: handleCsvSubmit,
        reset: resetCsv,
    } = useForm<{ document?: File | null }>({
        defaultValues: { document: undefined },
    });
    const [isUploading, setIsUploading] = useState(false);

    const {
        data: invoiceData,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ["invoice-data"],
        queryFn: async () => {
            return await fetchInvoiceList();
        },
        refetchInterval: 1000 * 60 * 5,
        refetchIntervalInBackground: true,
        // staleTime: 500,
        // gcTime: 20000,
    });

    // // Action handlers
    // const handleAssign = (id: number) => {
    //     // Implement assign logic
    // };
    // const handlePayNow = (id: number) => {
    //     // Implement pay now logic
    // };
    // const handleClose = (id: number) => {
    //     // Implement close logic
    // };
    return (
        <>
            <PageBreadcrumb pageTitle="Invoice Detail" />
            <div className="w-full">
                {/* Filter + Summary Row */}
                <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 mb-6">
                    <div className="flex flex-col gap-4 lg:flex-row">
                        {/* Left: Filters (3/4) */}
                        <div className="w-full lg:w-3/5">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-3">
                                Filter
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="md:col-span-1">
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
                                            { value: "query", label: "Query" },
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

                                <div className="md:col-span-1">
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
                            </div>

                            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <Label>Date From</Label>
                                    <DatePicker
                                        id="filter-date-from"
                                        placement="top"
                                        placeholder="Date from"
                                    />
                                </div>
                                <div>
                                    <Label>Date To</Label>
                                    <DatePicker
                                        id="filter-date-to"
                                        placement="top"
                                        placeholder="Date to"
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex gap-3">
                                <Button size="sm">Filter</Button>
                                <Button size="sm" variant="outline">
                                    Reset
                                </Button>
                            </div>
                        </div>

                        <div className="w-full lg:w-2/5">
                            <div className="mb-4 text-center rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                                </div>

                                <div className="flex items-end justify-between mt-5">
                                    <div>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            Customers
                                        </span>
                                        <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
                                            3,782
                                        </h4>
                                    </div>
                                    <Badge color="success">
                                        <ArrowUpIcon />
                                        11.01%
                                    </Badge>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { k: "In Progress", v: "In Progress" },
                                    { k: "Queued", v: "Queued" },
                                    { k: "Query", v: "Query" },
                                    {
                                        k: "TargetDay",
                                        v: "Target Day Tomorrow",
                                    },
                                    {
                                        k: "MaxPayment",
                                        v: "Max Payment Day Tomorrow",
                                    },
                                    { k: "Overdue", v: "Overdue" },
                                ].map((s) => (
                                    <div
                                        key={s.k}
                                        className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] "
                                    >
                                        <div className="flex items-end justify-between ">
                                            <div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {s.v}
                                                </span>
                                                <h4 className="font-bold text-gray-800 text-lg dark:text-white/90">
                                                    0
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
                </div>

                {/* Invoice Table Section */}
                <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
                    <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                        <div className="w-full">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                                List of Invoices
                            </h3>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                            <Can permission="bordereau.create">
                                <Button
                                    size="sm"
                                    onClick={() =>
                                        navigate("/invoice-detail/create")
                                    }
                                >
                                    Add Invoice
                                </Button>
                            </Can>
                            <Can permission="bordereau.create">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsCsvModalOpen(true)}
                                >
                                    Upload CSV
                                </Button>
                            </Can>
                        </div>
                    </div>
                    <div className="max-w-full overflow-x-auto custom-scrollbar">
                        {/* <div className="min-w-[1000px] xl:min-w-full px-2">
                            {!isLoading && invoiceData ? (
                                <DataTable
                                    columns={columns}
                                    data={invoiceData}
                                />
                            ) : (
                                <div className="flex items-center justify-center py-12">
                                    <Spinner size="lg" />
                                </div>
                            )}
                        </div> */}
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

                                const form = new FormData();
                                form.append("file", file);

                                try {
                                    setIsUploading(true);
                                    try {
                                        await uploadInvoiceCsv(file);
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
                                                if (file) field.onChange(file);
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
            </div>
        </>
    );
}
