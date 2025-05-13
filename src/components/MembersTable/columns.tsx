import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Ник
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <Link href={`/profile/${row.original.id}`} className=" underline">
        {row.original.username}
      </Link>
    ),
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
    cell: ({ row }) => row.original.class,
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) {
        return true;
      }
      return filterValue.includes(row.getValue(columnId));
    },
  },
  {
    accessorKey: "class_gear_score",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        GS
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.class_gear_score,
  },
  {
    accessorKey: "joinedAtFormatted",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Дата вступления
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.joinedAtFormatted,
  },
  {
    accessorKey: "daysInGuild",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Дней в гильдии
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.daysInGuild,
  },
  {
    accessorKey: "primePercent",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Прайм %
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: number = row.original.primePercent ?? 0;

      const hue = Math.round((value / 100) * 120); // от 0 (красный) до 120 (зелёный)
      const color = `hsl(${hue}, 70%, 60%)`;

      return (
        <div
          className="text-center font-medium rounded px-1"
          style={{
            backgroundColor: color,
            color: "black",
          }}
        >
          {`${value.toFixed(0)}%`}
        </div>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "aglPercent",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        АГЛ %
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: number = row.original.aglPercent ?? 0;
      const hue = Math.round((value / 100) * 120);
      const color = `hsl(${hue}, 70%, 60%)`;

      return (
        <div
          className="text-center font-medium rounded px-1"
          style={{
            backgroundColor: color,
            color: "black",
          }}
        >
          {`${value.toFixed(0)}%`}
        </div>
      );
    },
    sortingFn: "basic",
  },
  {
    accessorKey: "totalPercent",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Итого %
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: number = row.original.totalPercent ?? 0;
      const hue = Math.round((value / 100) * 120);
      const color = `hsl(${hue}, 70%, 60%)`;
      return (
        <div
          className="text-center font-medium rounded px-1"
          style={{
            backgroundColor: color,
            color: "black",
          }}
        >
          {`${value.toFixed(0)}%`}
        </div>
      );
    },
    sortingFn: "basic",
  },
];
