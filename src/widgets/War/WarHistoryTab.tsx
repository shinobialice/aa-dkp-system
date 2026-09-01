"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  getWarPeriodHistory,
  type WarPeriodHistoryRow,
} from "@/actions/guildStatusSettings";
import {
  MODE_LABEL,
  MODE_ICON,
  FACTION_LABEL,
} from "@/shared/config/guildStatus";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "@/shared/ui/pagination";
import WarHistoryDetail from "./WarHistoryDetail";

const PAGE_SIZE = 10;

function formatDT(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
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

// Свой useEffect-фетч вместо серверного пропа из page.tsx: вкладку "История"
// Radix не монтирует, пока по ней не кликнут (нет forceMount) — так что этот
// лишний запрос к БД естественным образом откладывается до того момента,
// когда он реально нужен.
export default function WarHistoryTab() {
  const [rows, setRows] = useState<WarPeriodHistoryRow[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<WarPeriodHistoryRow | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getWarPeriodHistory(page, PAGE_SIZE).then(({ rows, total }) => {
      if (!isMounted) return;
      setRows(rows);
      setTotal(total);
      setLoading(false);
    });
    return () => {
      isMounted = false;
    };
  }, [page]);

  if (selected) {
    return (
      <WarHistoryDetail period={selected} onBack={() => setSelected(null)} />
    );
  }

  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Загрузка...
      </p>
    );
  }

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        История появится, когда закончится текущий период.
      </p>
    );
  }

  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          onClick={() => setSelected(row)}
          className="flex w-full items-center gap-3 rounded-lg border p-3 text-left hover:bg-muted cursor-pointer"
        >
          <Image
            src={MODE_ICON[row.mode]}
            alt={MODE_LABEL[row.mode]}
            width={28}
            height={28}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {MODE_LABEL[row.mode]}
              {row.opponentGuild && (
                <span className="text-muted-foreground">
                  {" "}
                  против {row.opponentGuild}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.server} · {FACTION_LABEL[row.faction]} ·{" "}
              {formatDT(row.startedAt)} – {formatDT(row.endedAt)}
            </p>
          </div>
          <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
        </button>
      ))}

      {maxPage > 1 && (
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
      )}
    </div>
  );
}
