"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const data: Payment[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    email: "Dimonish",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    email: "Dimonish1",
  },
  {
    id: "derv1ws0",
    amount: 837,
    email: "Dimonish2",
  },
  {
    id: "5kma53ae",
    amount: 874,
    email: "Dimonish3",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "derv1ws0",
    amount: 837,
    email: "Dimonish2",
  },
  {
    id: "5kma53ae",
    amount: 874,
    email: "Dimonish3",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "derv1ws0",
    amount: 837,
    email: "Dimonish2",
  },
  {
    id: "5kma53ae",
    amount: 874,
    email: "Dimonish3",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    email: "Dimonish4",
  },
];

export type Payment = {
  id: string;
  amount: number;
  email: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ник
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Класс
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("amount")}</div>
    ),
  },
];

export function SelectRaidList() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn("email")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("email")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Фильтр <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
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
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
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
                  Нет результатов.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} из{" "}
          {table.getFilteredRowModel().rows.length} выбраны.
        </div>
      </div>
    </div>
  );
}
