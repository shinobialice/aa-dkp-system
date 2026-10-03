"use client";

import { useState } from "react";
import type { GuildStatus } from "@/actions/guildStatusSettings";
import {
  getWarPeriodHistory,
  type WarPeriodHistoryRow,
} from "@/actions/warPeriodHistory";
import { useAsyncData } from "@/hooks/useAsyncData";
import { useClock } from "@/hooks/useClock";
import { FACTION_LABEL } from "@/shared/config/guildStatus";
import { plural } from "@/shared/lib/format";
import { PagePagination } from "@/shared/ui";
import WarHistoryDetail from "../WarHistoryDetail";
import {
  formatFullDate,
  formatSpan,
  MINUTE_MS,
  MINUTE_POLL_MS,
} from "../warModel";
import PeriodRow from "./PeriodRow";

const PAGE_SIZE = 10;

type Props = {
  current: GuildStatus;
  currentOpponents: string[];
  onOpenCurrent: () => void;
};

export default function WarHistoryTab({
  current,
  currentOpponents,
  onOpenCurrent,
}: Props) {
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<WarPeriodHistoryRow | null>(null);
  const now = useClock(MINUTE_MS, MINUTE_POLL_MS);
  const history = useAsyncData(`war-history-${page}`, () =>
    getWarPeriodHistory(page, PAGE_SIZE),
  );

  if (selected) {
    return (
      <WarHistoryDetail
        key={selected.id}
        period={selected}
        onBack={() => setSelected(null)}
      />
    );
  }

  const rows = history.data?.rows ?? [];
  const total = history.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentDuration =
    current.startedAt && now !== null
      ? formatSpan(current.startedAt, now)
      : null;

  return (
    <section aria-label="Все периоды" className="flex flex-col gap-2.5">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold">Все периоды</h2>
        {!history.isLoading && (
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
          where={placeLabel(
            current.server,
            current.faction,
            current.mode === "pvp" ? currentOpponents : [],
          )}
          dates={
            current.startedAt
              ? `с ${formatFullDate(current.startedAt)}`
              : "дата начала не указана"
          }
          duration={currentDuration}
          onClick={onOpenCurrent}
        />
      )}

      <HistoryList
        loading={history.isLoading}
        rows={rows}
        onSelect={setSelected}
      />

      {pageCount > 1 && (
        <PagePagination
          className="mt-3"
          page={page}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </section>
  );
}

type HistoryListProps = {
  loading: boolean;
  rows: WarPeriodHistoryRow[];
  onSelect: (row: WarPeriodHistoryRow) => void;
};

function HistoryList({ loading, rows, onSelect }: HistoryListProps) {
  if (loading) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        Загрузка…
      </p>
    );
  }
  if (rows.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        Прошедшие периоды появятся здесь, когда закончится текущий
      </p>
    );
  }
  return rows.map((row) => (
    <PeriodRow
      key={row.id}
      mode={row.mode}
      live={false}
      where={placeLabel(row.server, row.faction, opponentsOf(row))}
      dates={`${formatFullDate(row.startedAt)} — ${formatFullDate(row.endedAt)}`}
      duration={formatSpan(row.startedAt, new Date(row.endedAt).getTime())}
      onClick={() => onSelect(row)}
    />
  ));
}

function placeLabel(
  server: string,
  faction: GuildStatus["faction"],
  opponents: string[],
) {
  const versus = opponents.length ? ` · против ${opponents.join(", ")}` : "";
  return `${server} · ${FACTION_LABEL[faction]}${versus}`;
}

function opponentsOf(row: WarPeriodHistoryRow): string[] {
  return [
    row.opponentGuild,
    ...row.extraOpponents.map((opponent) => opponent.name),
  ].filter((name): name is string => !!name);
}
