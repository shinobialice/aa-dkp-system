"use client";

import { useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

export default function MembersTable({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleToggle = async (userId, field) => {
    //
  };

  const tableData = users.map((user) => {
    const daysInGuild = user.joined_at
      ? Math.floor(
          (new Date().getTime() - new Date(user.joined_at).getTime()) /
            (1000 * 3600 * 24)
        )
      : 0;

    return {
      ...user,
      daysInGuild,
      joinedAtFormatted: user.joined_at
        ? new Date(user.joined_at).toLocaleDateString("ru-RU")
        : "-",
      toggleActive: () => handleToggle(user.id, "active"),
      toggleSalary: () => handleToggle(user.id, "is_eligible_for_salary"),
    };
  });

  return (
    <DataTable
      columns={columns}
      data={tableData}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
}
