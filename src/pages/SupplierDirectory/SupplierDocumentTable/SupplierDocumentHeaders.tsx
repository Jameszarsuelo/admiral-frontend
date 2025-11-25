// import { Button as CustomButton } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
// import { ArrowUpDown, BadgeCheckIcon } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
import { ISupplierDocumentSchema } from "@/types/SupplierSchema";
import { dateFormat } from "@/helper/dateFormat";
import Button from "@/components/ui/button/Button";
import { downloadSupplierDocument } from "@/database/supplier_api";

export const getSupplierDocumentHeaders =
    (): ColumnDef<ISupplierDocumentSchema>[] => [
        {
            accessorKey: "name",
            header: () => <div className="ml-4">Document Name</div>,
            cell: ({ row }) => (
                <div className=" dark:text-white ml-4">
                    {row.getValue("name")}
                </div>
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
                    {dateFormat(row.getValue("expiry_date"))}
                </div>
            ),
        },
        {
            id: "actions",
            header: () => <div>Actions</div>,
            cell: ({ row }) => {
                const document = row.original;

                const handleDownload = async (id: number) => {
                    const blob = await downloadSupplierDocument(id);

                    // Create blob link to download
                    const url = window.URL.createObjectURL(blob);
                    const link = window.document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", row.getValue("name")); // file name from your DB
                    window.document.body.appendChild(link);
                    link.click();

                    // Cleanup
                    link.remove();
                    window.URL.revokeObjectURL(url);
                };

                const handleOpen = async (id: number) => {
                    const blob = await downloadSupplierDocument(id);

                    // Create blob link to open
                    const url = window.URL.createObjectURL(blob);
                    window.open(url, "_blank");

                    // Cleanup
                    window.URL.revokeObjectURL(url);
                }

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
                    </div>
                );
            },
        },
        // {
        //     accessorKey: "email",
        //     accessorFn: (row) => row.email,
        //     header: ({ column }) => {
        //         return (
        //             <CustomButton
        //                 variant="ghost"
        //                 onClick={() =>
        //                     column.toggleSorting(column.getIsSorted() === "asc")
        //                 }
        //             >
        //                 Email
        //                 <ArrowUpDown />
        //             </CustomButton>
        //         );
        //     },
        //     cell: ({ row }) => (
        //         <div className=" dark:text-white ml-4">{row.getValue("email")}</div>
        //     ),
        // },

        // {
        //     accessorKey: "mobile",
        //     accessorFn: (row) => row.mobile,
        //     header: () => <div className="ml-4">Mobile</div>,
        //     cell: ({ row }) => (
        //         <div className="capitalize dark:text-white ml-4">
        //             {row.getValue("mobile")}
        //         </div>
        //     ),
        // },
        // {
        //     accessorKey: "phone",
        //     accessorFn: (row) => row.phone,
        //     header: () => <div className="ml-4">Landline</div>,
        //     cell: ({ row }) => (
        //         <div className="capitalize dark:text-white ml-4">
        //             {row.getValue("phone")}
        //         </div>
        //     ),
        // },
        // {
        //     accessorKey: "type",
        //     accessorFn: (row) => row.type,
        //     header: () => <div className="ml-4">Contact Type</div>,
        //     cell: ({ row }) => (
        //         <Badge
        //             variant="secondary"
        //             className="ml-4 inline-flex items-center"
        //         >
        //             <BadgeCheckIcon className="mr-1 inline-block" />
        //             {row.getValue("type") === 1
        //                 ? "Contact"
        //                 : row.getValue("type") === 2
        //                 ? "Supplier"
        //                 : "User"}
        //         </Badge>
        //     ),
        // },
    ];
