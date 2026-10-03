"use client";

import { useState } from "react";
import type { RespawnHistoryEntry } from "@/actions/getBossRespawnHistoryPage";
import { formatMoscowDateTime } from "@/shared/lib/format";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  PagePagination,
} from "@/shared/ui";
import { authorName } from "./historyModel";
import { useRespawnHistory } from "./useRespawnHistory";

const PAGE_SIZE = 10;
const COLUMNS = [
  "Босс",
  "Действие",
  "Время убийства",
  "Предыдущее время",
  "Следующий респаун",
  "Кто установил",
  "Когда установлено",
];

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function RespawnHistoryDialog({ open, onOpenChange }: Props) {
  const [page, setPage] = useState(1);
  const { rows, total, loading } = useRespawnHistory(page, PAGE_SIZE, open);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-h-[90vh] overflow-y-auto sm:max-w-4xl"
      >
        <DialogHeader>
          <DialogTitle>История убийств боссов · {total}</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                {COLUMNS.map((column) => (
                  <th key={column} className="border p-2">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <HistoryRows rows={rows} loading={loading} />
            </tbody>
          </table>
        </div>
        <PagePagination
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      </DialogContent>
    </Dialog>
  );
}

function HistoryRows({
  rows,
  loading,
}: {
  rows: RespawnHistoryEntry[];
  loading: boolean;
}) {
  if (loading || rows.length === 0) {
    return (
      <tr>
        <td colSpan={COLUMNS.length} className="p-4 text-center">
          {loading ? "Загрузка..." : "Нет записей"}
        </td>
      </tr>
    );
  }

  return rows.map((row) => (
    <tr key={row.id}>
      <td className="border p-2 font-bold">{row.boss_name}</td>
      <td className="border p-2">{row.action}</td>
      <td className="border p-2">{formatMoscowDateTime(row.kill_time)}</td>
      <td className="border p-2">{optionalDateTime(row.prev_kill_time)}</td>
      <td className="border p-2">{optionalDateTime(row.next_respawn)}</td>
      <td className="border p-2">{authorName(row)}</td>
      <td className="border p-2">{formatMoscowDateTime(row.created_at)}</td>
    </tr>
  ));
}

function optionalDateTime(value: string | null) {
  return value ? formatMoscowDateTime(value) : "-";
}
