"use client";

import { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";
import { getMembersTableData } from "@/actions/getMembersTableData";

const POLL_MS = 15000;

export default function MembersTable({ data }: { data: any[] }) {
  const [rows, setRows] = useState(data);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "class", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await getMembersTableData();
      if (fresh) setRows(fresh);
    }, POLL_MS);
    return () => clearInterval(interval);
  }, []);

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
