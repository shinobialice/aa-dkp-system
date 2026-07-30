"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

export default function MembersTable({ data }: { data: any[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <DataTable
      columns={columns}
      data={data}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
}
