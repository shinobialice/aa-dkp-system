"use client";

import { useEffect, useState } from "react";
import { getBossRespawnHistoryPage } from "@/actions/getBossRespawnHistoryPage";
import { getUsernamesByIds } from "@/actions/getUsernamesByIds";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/shared/ui/pagination";

interface HistoryRow {
  id: number;
  boss_name: string;
  action: string;
  kill_time: string;
  prev_kill_time: string | null;
  next_respawn: string | null;
  user_id: number;
  created_at: string;
  username: string;
}

const PAGE_SIZE = 4;

export default function BossRespawnHistory() {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchHistory(isInitial: boolean) {
      if (isInitial) setLoading(true);
      const { rows: data, total: count } = await getBossRespawnHistoryPage(
        page,
        PAGE_SIZE,
      );
      if (isMounted) setTotal(count);
      let userMap: Record<number, string> = {};
      if (data && data.length > 0) {
        const userIds = Array.from(
          new Set(data.map((row: any) => row.user_id)),
        );
        userMap = await getUsernamesByIds(userIds);
      }
      if (isMounted && data) {
        setRows(
          data.map((row: any) => ({
            ...row,
            username: userMap[row.user_id] || "?",
          })),
        );
      }
      if (isInitial) setLoading(false);
    }
    fetchHistory(true);
    // Поллинг вместо realtime-подписки (self-hosted Postgres без Supabase
    // Realtime) — обновляем список раз в 20 секунд. Фоновые обновления не
    // дёргают loading — иначе таблица каждые 20с на миг подменялась на
    // "Загрузка..." и это выглядело как бесконечная перезагрузка.
    const interval = setInterval(() => fetchHistory(false), 20_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [page]);

  return (
    <div className="mt-15 pb-3">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-base leading-none font-semibold">
          История убийств боссов
        </h2>
        <span className="text-xs text-muted-foreground">{total} записей</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-muted">
              <th className="p-2 border">Босс</th>
              <th className="p-2 border">Действие</th>
              <th className="p-2 border">Время убийства</th>
              <th className="p-2 border">Предыдущее время</th>
              <th className="p-2 border">Следующий респаун</th>
              <th className="p-2 border">Кто установил</th>
              <th className="p-2 border">Когда установлено</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Загрузка...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Нет записей
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="p-2 border font-bold">{row.boss_name}</td>
                  <td className="p-2 border">{row.action}</td>
                  <td className="p-2 border">{formatDT(row.kill_time)}</td>
                  <td className="p-2 border">
                    {row.prev_kill_time ? formatDT(row.prev_kill_time) : "-"}
                  </td>
                  <td className="p-2 border">
                    {row.next_respawn ? formatDT(row.next_respawn) : "-"}
                  </td>
                  <td className="p-2 border">{row.username}</td>
                  <td className="p-2 border">{formatDT(row.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Advanced pagination using shadcn primitives */}
      <Pagination className="mt-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setPage((p) => Math.max(1, p - 1));
              }}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {getPaginationItems(
            page,
            Math.max(1, Math.ceil(total / PAGE_SIZE)),
          ).map((item, idx) => (
            <PaginationItem key={idx}>
              {item.type === "ellipsis" ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={item.page === page}
                  onClick={(e) => {
                    e.preventDefault();
                    setPage(item.page);
                  }}
                >
                  {item.page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
                setPage((p) => Math.min(maxPage, p + 1));
              }}
              aria-disabled={page * PAGE_SIZE >= total}
              className={
                page * PAGE_SIZE >= total
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

function formatDT(dt: string) {
  return new Date(dt).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type PageItem = { type: "page"; page: number } | { type: "ellipsis" };
function getPaginationItems(current: number, total: number): PageItem[] {
  const pages: PageItem[] = [];
  const addPage = (p: number) => pages.push({ type: "page", page: p });
  if (total <= 7) {
    for (let i = 1; i <= total; i++) addPage(i);
  } else {
    const first = 1;
    const last = total;
    const window: number[] = [];
    for (let i = current - 1; i <= current + 1; i++) {
      if (i > first && i < last) window.push(i);
    }
    addPage(first);
    if (window[0] && window[0] > first + 1) pages.push({ type: "ellipsis" });
    window.forEach((w) => addPage(w));
    if (window[window.length - 1] && window[window.length - 1] < last - 1)
      pages.push({ type: "ellipsis" });
    addPage(last);
  }
  return pages;
}
