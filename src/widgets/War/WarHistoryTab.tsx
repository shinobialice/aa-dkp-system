"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import {
  getWarPeriodHistory,
  type GuildStatus,
  type WarPeriodHistoryRow,
} from "@/actions/guildStatusSettings";
import {
  FACTION_LABEL,
  MODE_ICON,
  MODE_LABEL,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/ui/pagination";
import WarHistoryDetail from "./WarHistoryDetail";
import { formatFullDate, formatSpan, plural, useMinuteNow } from "./warModel";

const PAGE_SIZE = 10;

type PageItem = { type: "page"; page: number } | { type: "ellipsis" };

function getPaginationItems(current: number, total: number): PageItem[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => ({
      type: "page",
      page: index + 1,
    }));
  }
  const items: PageItem[] = [{ type: "page", page: 1 }];
  const from = Math.max(2, current - 1);
  const to = Math.min(total - 1, current + 1);
  if (from > 2) items.push({ type: "ellipsis" });
  for (let page = from; page <= to; page += 1)
    items.push({ type: "page", page });
  if (to < total - 1) items.push({ type: "ellipsis" });
  items.push({ type: "page", page: total });
  return items;
}

function PeriodRow({
  mode,
  live,
  where,
  dates,
  duration,
  onClick,
}: {
  mode: WarPeriodHistoryRow["mode"];
  live: boolean;
  where: string;
  dates: string;
  duration: string | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full cursor-pointer grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border bg-card p-3 text-left transition-colors hover:bg-accent/50 sm:grid-cols-[52px_minmax(0,1fr)_auto_20px] sm:gap-4 sm:px-[18px] sm:py-4"
    >
      <Image
        src={MODE_ICON[mode]}
        alt=""
        width={52}
        height={52}
        className="size-10 object-contain sm:size-[52px]"
      />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold sm:text-base">{MODE_LABEL[mode]}</span>
          <span
            className={cn(
              "inline-flex h-[22px] items-center gap-1.5 rounded-full px-2 text-xs font-semibold",
              !live && "bg-muted text-muted-foreground",
              live &&
                mode === "pvp" &&
                "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
              live &&
                mode === "freeshard" &&
                "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400",
            )}
          >
            <span
              className={cn(
                "size-1.5 rounded-full",
                !live
                  ? "bg-muted-foreground/60"
                  : mode === "pvp"
                    ? "bg-red-600"
                    : "bg-green-600",
              )}
            />
            {live ? "Сейчас" : mode === "pvp" ? "Завершён" : "Завершена"}
          </span>
        </div>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">{where}</p>
        <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
          {dates}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <span className="font-bold tabular-nums sm:text-base">
          {duration ?? "—"}
        </span>
        <span className="text-xs text-muted-foreground">длительность</span>
      </div>
      <ChevronRight className="hidden size-[18px] text-muted-foreground sm:block" />
    </button>
  );
}

function opponentsOf(row: WarPeriodHistoryRow): string[] {
  return [
    row.opponentGuild,
    ...row.extraOpponents.map((opponent) => opponent.name),
  ].filter((name): name is string => !!name);
}

export default function WarHistoryTab({
  current,
  currentOpponents,
  onOpenCurrent,
}: {
  current: GuildStatus;
  currentOpponents: string[];
  onOpenCurrent: () => void;
}) {
  const [rows, setRows] = useState<WarPeriodHistoryRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadedPage, setLoadedPage] = useState<number | null>(null);
  const [selected, setSelected] = useState<WarPeriodHistoryRow | null>(null);
  const now = useMinuteNow();

  useEffect(() => {
    let cancelled = false;
    getWarPeriodHistory(page, PAGE_SIZE).then((result) => {
      if (cancelled) return;
      setRows(result.rows);
      setTotal(result.total);
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);

  if (selected) {
    return (
      <WarHistoryDetail
        key={selected.id}
        period={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  const loading = loadedPage !== page;
  const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentVersus =
    current.mode === "pvp" && currentOpponents.length
      ? ` · против ${currentOpponents.join(", ")}`
      : "";

  return (
    <section aria-label="Все периоды" className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-[15px] font-semibold">Все периоды</h2>
        {!loading && (
          <span className="text-xs text-muted-foreground">
            {total + 1} {plural(total + 1, "период", "периода", "периодов")} ·
            новые сверху
          </span>
        )}
      </div>

      {page === 1 && (
        <PeriodRow
          mode={current.mode}
          live
          where={`${current.server} · ${FACTION_LABEL[current.faction]}${currentVersus}`}
          dates={
            current.startedAt
              ? `с ${formatFullDate(current.startedAt)}`
              : "дата начала не указана"
          }
          duration={
            current.startedAt && now !== null
              ? formatSpan(current.startedAt, now)
              : null
          }
          onClick={onOpenCurrent}
        />
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Загрузка…
        </p>
      ) : total === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
          Прошедшие периоды появятся здесь, когда закончится текущий
        </p>
      ) : (
        rows.map((row) => {
          const opponents = opponentsOf(row);
          return (
            <PeriodRow
              key={row.id}
              mode={row.mode}
              live={false}
              where={`${row.server} · ${FACTION_LABEL[row.faction]}${opponents.length ? ` · против ${opponents.join(", ")}` : ""}`}
              dates={`${formatFullDate(row.startedAt)} — ${formatFullDate(row.endedAt)}`}
              duration={formatSpan(
                row.startedAt,
                new Date(row.endedAt).getTime(),
              )}
              onClick={() => setSelected(row)}
            />
          );
        })
      )}

      {maxPage > 1 && (
        <Pagination className="mt-3">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  setPage((value) => Math.max(1, value - 1));
                }}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {getPaginationItems(page, maxPage).map((item, index) => (
              <PaginationItem key={index}>
                {item.type === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href="#"
                    isActive={item.page === page}
                    onClick={(event) => {
                      event.preventDefault();
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
                onClick={(event) => {
                  event.preventDefault();
                  setPage((value) => Math.min(maxPage, value + 1));
                }}
                aria-disabled={page >= maxPage}
                className={
                  page >= maxPage ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </section>
  );
}
