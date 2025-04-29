import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<any>[] = [
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Ник
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Дней в гильдии
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.daysInGuild,
  },
];
