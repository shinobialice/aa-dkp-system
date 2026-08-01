"use client";

import { useState } from "react";
import { ColumnDef, SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { columns } from "@/widgets/MembersTable/columns";
import { DataTable } from "@/widgets/MembersTable/data-table";
import { Button } from "@/shared/ui";

function formatDaysAfk(afkSince: string | null): string {
  if (!afkSince) return "неизвестно";

  const days = Math.floor(
    (Date.now() - new Date(afkSince).getTime()) / (1000 * 3600 * 24),
  );

  if (days <= 0) return "меньше дня";

  const lastDigit = days % 10;
  const lastTwoDigits = days % 100;
  let unit = "дней";
  if (lastTwoDigits < 11 || lastTwoDigits > 14) {
    if (lastDigit === 1) unit = "день";
    else if (lastDigit >= 2 && lastDigit <= 4) unit = "дня";
  }

  return `${days} ${unit}`;
}

const afkSinceColumn: ColumnDef<any> = {
  accessorKey: "afk_since",
  header: ({ column }) => (
    <Button
      className="cursor-pointer"
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      АФК
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  ),
  cell: ({ row }) => formatDaysAfk(row.original.afk_since),
  sortingFn: "datetime",
};

const attendanceColumnKeys = ["primePercent", "aglPercent", "totalPercent"];

const afkColumns = [
  ...columns.filter(
    (col) => !attendanceColumnKeys.includes((col as { accessorKey?: string }).accessorKey ?? ""),
  ),
  afkSinceColumn,
];

export default function AfkMembersTable({ data }: { data: any[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <DataTable
      columns={afkColumns}
      data={data}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
}
