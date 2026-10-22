import Link from "next/link";
import type { AglItem } from "@/server/killcountEntries/types";
import { formatDuration, formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { longDate, weekday } from "../../ui/killcountModel";
import { entryHref, playersText, windowMinutes } from "./killcountEntriesModel";

type Props = {
  items: AglItem[];
  selectedKey: string | null;
};

const ROW =
  "grid grid-cols-[3.25rem_minmax(0,1fr)_auto] items-center gap-x-3 px-3.5 py-2";

export default function AglList({ items, selectedKey }: Props) {
  const scanned = items.filter((item) => item.record);
  const days = [...new Set(items.map((item) => item.day))];

  return (
    <section
      aria-label="АГЛ"
      className="min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="flex items-baseline justify-between gap-2 border-b px-3.5 py-2.5">
        <h2 className="font-semibold">АГЛ</h2>
        <span className="text-xs text-muted-foreground">
          со сканером {scanned.length} из {items.length}
        </span>
      </div>
      <div className="max-h-[min(40rem,calc(100dvh-14rem))] overflow-auto overscroll-contain">
        {days.map((day) => (
          <section key={day} aria-label={longDate(day)}>
            <h3 className="sticky top-0 z-10 bg-muted px-3.5 py-1.5 text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
              {longDate(day)} · {weekday(day)}
            </h3>
            <ol>
              {items
                .filter((item) => item.day === day)
                .map((item) => (
                  <li key={item.key} className="border-b last:border-b-0">
                    <AglRow item={item} isSelected={item.key === selectedKey} />
                  </li>
                ))}
            </ol>
          </section>
        ))}
        {items.length === 0 && (
          <p className="px-3.5 py-8 text-center text-muted-foreground">
            АГЛ за последние полтора месяца не было
          </p>
        )}
      </div>
    </section>
  );
}

function AglRow({ item, isSelected }: { item: AglItem; isSelected: boolean }) {
  if (!item.record) {
    return (
      <div className={cn(ROW, "text-muted-foreground")}>
        <span className="text-sm tabular-nums">{item.time}</span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate">{item.boss}</span>
          <span className="text-2xs">{item.people} чел. в посещении</span>
        </span>
        <span className="text-2xs">без сканера</span>
      </div>
    );
  }
  const { record } = item;
  return (
    <Link
      prefetch={false}
      href={entryHref("agl", item.key)}
      aria-current={isSelected ? "page" : undefined}
      className={cn(
        ROW,
        "hover:bg-muted/50",
        isSelected && "bg-muted/70 shadow-[inset_3px_0_0_var(--color-red-500)]",
      )}
    >
      <span className="text-sm font-semibold tabular-nums">{item.time}</span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-semibold">{item.boss}</span>
        <span className="text-2xs text-muted-foreground">
          {playersText(record.fighters)} ·{" "}
          {formatDuration(windowMinutes(record.window))} ·{" "}
          {record.window.scannedBy}
        </span>
      </span>
      <span className="text-right text-base font-bold tabular-nums">
        {formatNumber(record.totalKills)}
      </span>
    </Link>
  );
}
