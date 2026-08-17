"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { getMembersTableData } from "@/actions/getMembersTableData";
import { useBroadcastPing } from "@/hooks/useBroadcastPing";

export default function MembersTable({ data }: { data: any[] }) {
  const [rows, setRows] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "class", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useBroadcastPing("members-changes", async () => {
    const fresh = await getMembersTableData();
    if (fresh) setRows(fresh);
  });

  return (
    <DataTable
      columns={columns}
      data={rows}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
}
