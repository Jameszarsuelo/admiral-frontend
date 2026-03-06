import * as React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    PaginationState,
    getSortedRowModel,
    SortingState,
    Updater,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Button from "./button/Button";
import { Input } from "./input";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    onRowSelectionChange?: (selected: TData[]) => void;
    /**
     * When provided, DataTable becomes pagination-controlled (useful for server-side pagination).
     * pageIndex is 0-based.
     */
    pagination?: PaginationState;
    onPaginationChange?: (updater: Updater<PaginationState>) => void;
    /** Total number of pages when using manual pagination. */
    pageCount?: number;
    /** Enable manual pagination mode (server-side). */
    manualPagination?: boolean;

    /**
     * When true, the table will not apply client-side filtering.
     * Useful when the data is already filtered server-side.
     */
    manualFiltering?: boolean;

    /** Optional controlled global filter value (search box). */
    globalFilter?: string;
    /** Optional controlled global filter handler (search box). */
    onGlobalFilterChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onRowSelectionChange,
    pagination: paginationProp,
    onPaginationChange: onPaginationChangeProp,
    pageCount,
    manualPagination,
    manualFiltering,
    globalFilter: globalFilterProp,
    onGlobalFilterChange: onGlobalFilterChangeProp,
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const paginationState = paginationProp ?? pagination;
    const onPaginationChange = onPaginationChangeProp ?? setPagination;

    const csvEscape = React.useCallback((value: unknown) => {
        const normalized =
            value === null || value === undefined
                ? ""
                : typeof value === "string"
                  ? value
                  : typeof value === "number" || typeof value === "boolean"
                    ? String(value)
                    : JSON.stringify(value);

        const needsQuotes = /[\n\r,"]/.test(normalized);
        const escaped = normalized.replace(/"/g, '""');
        return needsQuotes ? `"${escaped}"` : escaped;
    }, []);


    const resolvedGlobalFilter = globalFilterProp ?? globalFilter;
    const setResolvedGlobalFilter = React.useCallback(
        (value: string) => {
            if (onGlobalFilterChangeProp) {
                onGlobalFilterChangeProp(value);
                return;
            }
            setGlobalFilter(value);
        },
        [onGlobalFilterChangeProp],
    );

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setResolvedGlobalFilter,
        globalFilterFn: "includesString",
        manualPagination: Boolean(manualPagination),
        pageCount: manualPagination ? pageCount : undefined,
        manualFiltering: Boolean(manualFiltering),
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter: resolvedGlobalFilter,
            pagination: paginationState,
        },
    });

    const exportCsv = React.useCallback(() => {
        const visibleColumns = table.getVisibleLeafColumns();

        const headers = visibleColumns.map((col) => {
            const header = col.columnDef.header;
            return typeof header === "string" && header.trim().length > 0
                ? header
                : col.id;
        });

        const rows = table.getRowModel().rows;

        const csvLines: string[] = [];
        csvLines.push(headers.map(csvEscape).join(","));
        for (const row of rows) {
            const values = visibleColumns.map((col) =>
                csvEscape(row.getValue(col.id)),
            );
            csvLines.push(values.join(","));
        }

        const csv = csvLines.join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        const date = new Date().toISOString().slice(0, 10);
        link.download = `table-export-${date}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }, [csvEscape, table]);

    React.useEffect(() => {
        if (onRowSelectionChange) {
            const selected = table
                .getFilteredSelectedRowModel()
                .rows.map((r) => r.original as TData);
            onRowSelectionChange(selected);
        }
        // Only run when selection or callback changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection, onRowSelectionChange]);

    return (
        <>
            <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                <Input
                    placeholder="Search all columns..."
                    value={resolvedGlobalFilter ?? ""}
                    onChange={(event) => setResolvedGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                            Rows
                        </span>
                        <select
                            className="h-9 rounded-md border bg-transparent px-2 text-sm"
                            value={table.getState().pagination.pageSize}
                            onChange={(e) =>
                                table.setPageSize(Number(e.target.value))
                            }
                        >
                            {[10, 25, 50, 100].map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={exportCsv}
                        disabled={table.getRowModel().rows.length === 0}
                    >
                        Export CSV
                    </Button>
                </div>
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="text-muted-foreground flex-1 text-sm">
                    {table.getFilteredSelectedRowModel().rows.length} of{" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </>
    );
}
