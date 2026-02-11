// import { Button as CustomButton } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
// import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { ISupplierDocumentSchema } from "@/types/SupplierSchema";
import { dateFormat } from "@/helper/dateFormat";
import Button from "@/components/ui/button/Button";
import {
    downloadSupplierDocument,
    removeSupplierDocument,
} from "@/database/supplier_api";
import { toast } from "sonner";
import { coerceBlobType, makeObjectUrl } from "@/helper/blobFile";

export const getSupplierDocumentHeaders = (
    supplierId: number,
    refetch: () => void,
    isAdmin: boolean,
): ColumnDef<ISupplierDocumentSchema>[] => [
    {
        accessorKey: "name",
        header: () => <div className="ml-4">Document Name</div>,
        cell: ({ row }) => (
            <div className=" dark:text-white ml-4">{row.getValue("name")}</div>
        ),
    },
    {
        accessorKey: "description",
        header: () => <div className="ml-4">Description</div>,
        cell: ({ row }) => (
            <div className=" dark:text-white ml-4">
                {row.getValue("description")}
            </div>
        ),
    },
    {
        accessorKey: "expiry_date",
        header: () => <div className="ml-4">Expiry Date</div>,
        cell: ({ row }) => (
            <div className=" dark:text-white ml-4">
                {row.getValue("expiry_date")
                    ? dateFormat(row.getValue("expiry_date"))
                    : "Non Expiring"}
            </div>
        ),
    },
    {
        id: "actions",
        header: () => <div>Actions</div>,
        cell: ({ row }) => {
            const document = row.original;

            const handleDownload = async (id: number) => {
                const filename = String(row.getValue("name") ?? `document-${id}`);
                const blob = await downloadSupplierDocument(id);
                const typedBlob = coerceBlobType(blob, filename);
                const { url } = makeObjectUrl(typedBlob);

                const link = window.document.createElement("a");
                link.href = url;
                link.download = filename;
                window.document.body.appendChild(link);
                link.click();
                link.remove();
            };

            const handleDelete = async (id: number) => {
                toast.promise(removeSupplierDocument(id, supplierId), {
                    loading: "Delinking the document to this Supplier...",
                    success: () => {
                        refetch();
                        return "Document successfully delinked!";
                    },
                });
            };

            const handleOpen = async (id: number) => {
                const filename = String(row.getValue("name") ?? `document-${id}`);

                // Open the tab synchronously to avoid popup blockers
                const opened = window.open(
                    "",
                    "_blank",
                    "noopener,noreferrer,width=1000,height=800",
                );
                if (opened) {
                    try {
                        opened.document.title = filename;
                        opened.document.body.innerHTML = "<p style='font-family: system-ui; padding: 16px;'>Loading...</p>";
                    } catch {
                        // ignore
                    }
                }

                const blob = await downloadSupplierDocument(id);
                const typedBlob = coerceBlobType(blob, filename);
                const { url } = makeObjectUrl(typedBlob);

                if (opened) {
                    opened.location.href = url;
                } else {
                    window.open(url, "_blank", "noopener,noreferrer,width=1000,height=800");
                }
            };

            return (
                <div className="flex gap-2">
                    <Button
                        onClick={() => handleOpen(document.id!)}
                        variant="secondary"
                        size="sm"
                    >
                        Open
                    </Button>
                    <Button
                        onClick={() => handleDownload(document.id!)}
                        variant="info"
                        size="sm"
                    >
                        Download
                    </Button>
                    {isAdmin && (
                        <Button
                            onClick={() => handleDelete(document.id!)}
                            variant="danger"
                            size="sm"
                        >
                            Delete
                        </Button>
                    )}
                </div>
            );
        },
    },
];
