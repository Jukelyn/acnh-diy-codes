"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<CSVItem> {
  columns: ColumnDef<CSVItem>[];
  data: CSVItem[];
}

const PAGINATION_MAX_ROWS = 5;

export function DataTable<CSVItem>({ columns, data }: DataTableProps<CSVItem>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex: false,
    initialState: {
      pagination: {
        pageSize: PAGINATION_MAX_ROWS,
      },
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="overflow-hidden rounded-md border">
        <Table className="table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // These columns should be smaller, not long info
                  const isSmall = [
                    "Internal ID as hex",
                    "Variation ID",
                    "actions",
                  ].includes(header.column.id);
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "first:pl-4 first:w-3xs last:pr-4 last:text-right",
                        isSmall ? "w-30" : "w-auto",
                        header.column.id === "actions" && "text-right",
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
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
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => {
                    const isSmall = [
                      "Internal ID as hex",
                      "Variation ID",
                      "actions",
                    ].includes(cell.column.id);

                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "first:pl-4 last:pr-4 truncate",
                          isSmall ? "w-30" : "w-auto",
                          cell.column.id === "actions" && "text-right",
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-16 text-center"
                >
                  No items selected.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div
        className={cn(
          "justify-between items-center",
          data.length > PAGINATION_MAX_ROWS ? "flex" : "hidden",
        )}
      >
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="items-center justify-end space-x-2 py-4">
          <Button
            className={cn(
              !table.getCanPreviousPage()
                ? "hidden"
                : "inline-flex cursor-pointer",
            )}
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
          >
            Previous
          </Button>
          <Button
            className={cn(
              !table.getCanNextPage() ? "hidden" : "inline-flex cursor-pointer",
            )}
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
