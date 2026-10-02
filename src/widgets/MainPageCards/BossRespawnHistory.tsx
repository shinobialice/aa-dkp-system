"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { getBossRespawnHistoryPage } from "@/actions/getBossRespawnHistoryPage";
import { getUsernamesByIds } from "@/actions/getUsernamesByIds";
import { bossImages } from "@/hooks/useUpcomingEvents";
import {
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from "@/shared/ui";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/shared/ui/pagination";
import { formatMoscowShort } from "./mainPageTime";

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

const RECENT_SIZE = 4;
const PAGE_SIZE = 10;

function useHistoryPage(page: number, pageSize: number, enabled: boolean) {
  const [rows, setRows] = useState<HistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!enabled) return;
    let isMounted = true;
    async function fetchHistory() {
      const { rows: data, total: count } = await getBossRespawnHistoryPage(
        page,
        pageSize,
      );
      let userMap: Record<number, string> = {};
      if (data && data.length > 0) {
        const userIds = Array.from(new Set(data.map((row: any) => row.user_id)));
        userMap = await getUsernamesByIds(userIds);
      }
      if (!isMounted) return;
      setTotal(count);
      setRows(
        (data ?? []).map((row: any) => ({
          ...row,
          username: userMap[row.user_id] || "?",
        })),
      );
      setLoading(false);
    }
    fetchHistory();
    const interval = setInterval(fetchHistory, 20_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [page, pageSize, enabled]);

  return { rows, total, loading };
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

function actionText(row: HistoryRow, now: Date) {
  const kill = formatMoscowShort(new Date(row.kill_time), now);
  return row.action === "Убит сейчас"
    ? `убит в ${kill}`
    : `${row.action.toLowerCase()}: ${kill}`;
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

function RespawnHistoryDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [page, setPage] = useState(1);
  const { rows, total, loading } = useHistoryPage(page, PAGE_SIZE, open);
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

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
                <th className="border p-2">Босс</th>
                <th className="border p-2">Действие</th>
                <th className="border p-2">Время убийства</th>
                <th className="border p-2">Предыдущее время</th>
                <th className="border p-2">Следующий респаун</th>
                <th className="border p-2">Кто установил</th>
                <th className="border p-2">Когда установлено</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    Загрузка...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-4 text-center">
                    Нет записей
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id}>
                    <td className="border p-2 font-bold">{row.boss_name}</td>
                    <td className="border p-2">{row.action}</td>
                    <td className="border p-2">{formatDT(row.kill_time)}</td>
                    <td className="border p-2">
                      {row.prev_kill_time ? formatDT(row.prev_kill_time) : "-"}
                    </td>
                    <td className="border p-2">
                      {row.next_respawn ? formatDT(row.next_respawn) : "-"}
                    </td>
                    <td className="border p-2">{row.username}</td>
                    <td className="border p-2">{formatDT(row.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination>
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
            {getPaginationItems(page, maxPage).map((item, idx) => (
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
                  setPage((p) => Math.min(maxPage, p + 1));
                }}
                aria-disabled={page >= maxPage}
                className={page >= maxPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </DialogContent>
    </Dialog>
  );
}

export default function BossRespawnHistory() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { rows, total, loading } = useHistoryPage(1, RECENT_SIZE, true);
  const now = new Date();

  return (
    <Card className="min-w-0 gap-0 py-0">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3.5">
        <h2 className="font-semibold">Последние отметки</h2>
        <Button
          variant="link"
          className="h-auto p-0 text-green-700 dark:text-green-400"
          onClick={() => setDialogOpen(true)}
        >
          Вся история · {total}
          <ChevronRight />
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: RECENT_SIZE }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-muted-foreground">
          Отметок пока нет
        </p>
      ) : (
        <ul>
          {rows.map((row) => (
            <li
              key={row.id}
              className="flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0"
            >
              {bossImages[row.boss_name] ? (
                <Image
                  src={bossImages[row.boss_name]}
                  alt=""
                  width={36}
                  height={36}
                  className="size-9 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <span className="size-9 shrink-0 rounded-lg bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate">
                  <span className="font-semibold">{row.boss_name}</span>{" "}
                  <span className="text-muted-foreground">— {actionText(row, now)}</span>
                </p>
                <p className="truncate text-xs text-muted-foreground sm:hidden">
                  {row.username} · {formatMoscowShort(new Date(row.created_at), now)}
                </p>
                <p className="hidden truncate text-xs text-muted-foreground sm:block">
                  {row.next_respawn &&
                    `Следующий респаун ${formatMoscowShort(new Date(row.next_respawn), now)}`}
                  {row.next_respawn && row.prev_kill_time && " · "}
                  {row.prev_kill_time &&
                    `до этого ${formatMoscowShort(new Date(row.prev_kill_time), now)}`}
                </p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-sm font-medium">{row.username}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatMoscowShort(new Date(row.created_at), now)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      <RespawnHistoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}
