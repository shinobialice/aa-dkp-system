"use client";

import { useState } from "react";
import { formatNumber } from "@/shared/lib/format";
import { Card, Skeleton } from "@/shared/ui";
import type { JournalDay } from "../journalModel";
import EntryRow from "./EntryRow";
import { isIncome, type RecordActions } from "./journalMeta";

const DAYS_STEP = 7;
const SKELETON_ROWS = 6;

type Props = RecordActions & {
  days: JournalDay[];
  isAdmin: boolean;
  loading: boolean;
  emptyText: string;
};

export default function JournalList({
  days,
  isAdmin,
  loading,
  emptyText,
  ...actions
}: Props) {
  const [visibleDays, setVisibleDays] = useState(DAYS_STEP);
  const [expanded, setExpanded] = useState<string | null>(null);
  const shown = days.slice(0, visibleDays);

  return (
    <Card className="min-w-0 gap-0 overflow-hidden p-0 lg:flex-[2]">
      {loading && (
        <div className="space-y-3 p-4">
          {Array.from({ length: SKELETON_ROWS }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      )}
      {!loading && shown.length === 0 && (
        <p className="px-4 py-12 text-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      )}
      {!loading &&
        shown.map((day) => (
          <section key={day.key}>
            <div className="flex h-9 items-center justify-between border-b bg-muted/40 px-4 text-sm">
              <h3 className="font-semibold">{day.label}</h3>
              <DayIncome day={day} />
            </div>
            {day.entries.map((entry) => (
              <EntryRow
                key={entry.key}
                entry={entry}
                isAdmin={isAdmin}
                expanded={expanded === entry.key}
                onToggle={() =>
                  setExpanded(expanded === entry.key ? null : entry.key)
                }
                {...actions}
              />
            ))}
          </section>
        ))}
      {!loading && days.length > shown.length && (
        <button
          type="button"
          onClick={() => setVisibleDays(visibleDays + DAYS_STEP)}
          className="h-12 w-full cursor-pointer border-t text-sm font-medium text-green-700 hover:bg-accent dark:text-green-400"
        >
          Показать более ранние записи
        </button>
      )}
    </Card>
  );
}

function DayIncome({ day }: { day: JournalDay }) {
  const total = day.entries
    .filter((entry) => isIncome(entry.kind))
    .reduce((sum, entry) => sum + entry.amount, 0);
  if (total <= 0) return null;

  return (
    <span className="font-semibold text-green-700 tabular-nums dark:text-green-400">
      +{formatNumber(total)}
    </span>
  );
}
