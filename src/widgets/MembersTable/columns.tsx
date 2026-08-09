import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Info } from "lucide-react";
import Link from "next/link";
import { classColors, classIcons } from "./classStyles";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";

export const columns: ColumnDef<any>[] = [
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
    cell: ({ row }) => (
      <Link
        href={`/profile/${row.original.id}`}
        className="flex items-center gap-2 underline"
      >
        <Avatar className="h-6 w-6 shrink-0">
          <AvatarImage
            src={
              row.original.avatar_url ??
              `https://api.dicebear.com/6.x/initials/svg?seed=${row.original.username}`
            }
            alt={row.original.username}
          />
          <AvatarFallback className="text-[10px]">
            {row.original.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
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
    cell: ({ row }) => {
      const cls: string | null = row.original.class;
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
  {
    accessorKey: "salary",
    header: ({ column }) => (
      <Button
        className="cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Зарплата
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value: number | null = row.original.salary;
      const reason: string | null = row.original.salaryReason;
      return (
        <div className="flex items-center gap-1">
          <span>{value != null ? value.toLocaleString("ru-RU") : "—"}</span>
          {reason && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="size-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent>{reason}</TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
    sortingFn: "basic",
  },
];
