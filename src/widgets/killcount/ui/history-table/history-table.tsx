"use client";
import { Button, DataTable, Typography } from "@/shared/ui";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import Link from "next/link";
import { FC, useState } from "react";

export interface KillCountHistoryData {
  date: string;
  totalKills: string;
}

interface KillCountHistoryTableProps {
  history: KillCountHistoryData[] | undefined;
}

const columnHelper = createColumnHelper<KillCountHistoryData>();

export const KillCountHistoryTable: FC<KillCountHistoryTableProps> = ({
  history,
}) => {
  const columns = [
    columnHelper.accessor("date", {
      header: "Дата",
      cell: (info) => {
        const label = new Date(info.getValue()).toLocaleString("ru-RU", {
          year: "2-digit",
          month: "long",
          day: "numeric",
        });

        return (
          <Link
            prefetch={false}
            href={`history/${info.getValue()?.split("T")?.at(0)}`}
            className="hover:underline inline-block"
          >
            <Typography>{label}</Typography>
          </Link>
        );
      },
    }),
    columnHelper.accessor("totalKills", {
      header: "Суммарное количество килов",
    }),
  ];

  return <DataTable columns={columns} data={history ?? []} />;
};
