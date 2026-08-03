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
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { classColors, classIcons } from "../../../MembersTable/classStyles";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Checkbox } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { ScrollArea } from "@/shared/ui";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

export type User = {
  id: number;
  username: string;
  class: string;
  active: boolean;
};

type SelectRaidListProps = {
  users: User[];
  lateUserIds: Record<number, boolean>;
  setLateUserIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
};

function buildColumns(
  lateUserIds: Record<number, boolean>,
  setLateUserIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>,
): ColumnDef<User>[] {
  return [
    {
      accessorKey: "username",
      header: ({ column }) => (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ник
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("username")}</div>,
    },
    {
      accessorKey: "class",
      header: ({ column }) => (
        <Button
          className="cursor-pointer"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Класс
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const cls = row.getValue("class") as string;
        if (!cls) return "—";
        return (
          <Badge
            className="text-background gap-1"
            style={{ backgroundColor: classColors[cls] ?? "rgb(120,120,120)" }}
          >
            {classIcons[cls]}
            {cls}
          </Badge>
        );
      },
    },
    {
      id: "late",
      header: "Опоздал",
      cell: ({ row }) => {
        const userId = row.original.id;
        return (
          <Checkbox
            className="cursor-pointer"
            checked={!!lateUserIds[userId]}
            onCheckedChange={(checked) =>
              setLateUserIds((prev) => ({ ...prev, [userId]: checked === true }))
            }
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
      enableSorting: false,
    },
  ];
}

export function SelectedRaidList({
  users,
  lateUserIds,
  setLateUserIds,
}: SelectRaidListProps) {
  const columns = React.useMemo(
    () => buildColumns(lateUserIds, setLateUserIds),
    [lateUserIds, setLateUserIds],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const activeUsers = React.useMemo(
    () => users.filter((u) => u.active),
    [users],
  );

  const table = useReactTable({
    data: activeUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  return (
    <div className="w-full">
      <Label className="pb-4">Выбранные игроки</Label>
      <div className="rounded-md border">
        <ScrollArea className="w-full h-200">
          <Table>
            <TableHeader className="sticky top-0 z-1 bg-background">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {(() => {
                if (table.getRowModel().rows?.length) {
                  return table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={() => {
                        row.toggleSelected();
                      }}
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
                  ));
                }
                return (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Нет результатов.
                    </TableCell>
                  </TableRow>
                );
              })()}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
      <div className="flex justify-end space-x-2 py-4" />
    </div>
  );
}
