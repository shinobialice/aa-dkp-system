"use client";

import { useEffect, useState } from "react";
import { getAllUsersActivityWithPercent } from "@/actions/getAllUsersActivityWithPercent";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { SortingState, ColumnFiltersState } from "@tanstack/react-table";

export default function MembersTable({
  users: initialUsers,
}: {
  users: any[];
}) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ состояние сортировки и фильтров
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  useEffect(() => {
    async function load() {
      const activity = await getAllUsersActivityWithPercent();
      const tableData = initialUsers.map((user) => {
        const act = activity[user.id] ?? {
          primePercent: 0,
          aglPercent: 0,
          totalPercent: 0,
        };

        const daysInGuild = user.joined_at
          ? Math.floor(
              (new Date().getTime() - new Date(user.joined_at).getTime()) /
                (1000 * 3600 * 24),
            )
          : 0;

        return {
          ...user,
          daysInGuild,
          joinedAtFormatted: user.joined_at
            ? new Date(user.joined_at).toLocaleDateString("ru-RU")
            : "-",
          ...act,
        };
      });

      setUsers(tableData);
      setLoading(false);
    }

    load();
  }, [initialUsers]);

  if (loading) return <div>Загрузка...</div>;

  return (
    <DataTable
      columns={columns}
      data={users}
      sorting={sorting}
      setSorting={setSorting}
      columnFilters={columnFilters}
      setColumnFilters={setColumnFilters}
    />
  );
}
