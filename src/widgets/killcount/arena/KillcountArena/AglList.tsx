import Link from "next/link";
import type { AglItem } from "@/server/killcountArena/types";
import { formatDuration, formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import ArenaPanel from "@/widgets/arena/ArenaPanel";
import { longDate } from "../../ui/killcountModel";
import {
  arenaHref,
  fightersText,
  weekdayLong,
  windowMinutes,
} from "./killcountArenaModel";

type Props = {
  items: AglItem[];
  selectedKey: string | null;
};

const ROW =
  "grid min-h-14 grid-cols-[64px_minmax(0,1fr)_76px] items-center gap-3 px-5 py-2";

export default function AglList({ items, selectedKey }: Props) {
  const scanned = items.filter((item) => item.record);
  const maxKills = Math.max(
    1,
    ...scanned.map((item) => item.record?.totalKills ?? 0),
  );
  const days = [...new Set(items.map((item) => item.day))];

  return (
    <ArenaPanel
      title="АГЛ"
      meta={`со сканером ${scanned.length} из ${items.length}`}
      className="gap-0 p-0 sm:p-0 [&>div:first-child]:px-5 [&>div:first-child]:pt-4 [&>div:first-child]:pb-3"
    >
      <div className="max-h-[720px] overflow-auto border-t [scrollbar-width:thin]">
        {days.map((day) => (
          <section key={day} aria-label={longDate(day)}>
            <h3 className="sticky top-0 z-[1] bg-muted px-5 py-1.5 text-2xs tracking-widest text-muted-foreground uppercase">
              {longDate(day)} · {weekdayLong(day)}
            </h3>
            <ol>
              {items
                .filter((item) => item.day === day)
                .map((item) => (
                  <li
                    key={item.key}
                    className="border-b border-border/60 last:border-b-0"
                  >
                    <AglRow
                      item={item}
                      maxKills={maxKills}
                      isSelected={item.key === selectedKey}
                    />
                  </li>
                ))}
            </ol>
          </section>
        ))}
        {items.length === 0 && (
          <p className="px-5 py-8 text-center text-muted-foreground">
            АГЛ за последние полтора месяца не было
          </p>
        )}
      </div>
    </ArenaPanel>
  );
}

function AglRow({
  item,
  maxKills,
  isSelected,
}: {
  item: AglItem;
  maxKills: number;
  isSelected: boolean;
}) {
  if (!item.record) {
    return (
      <div className={cn(ROW, "text-muted-foreground")}>
        <TimeCell time={item.time} isDashed />
        <span className="min-w-0">
          <span className="block truncate font-medium">{item.boss}</span>
          <span className="block truncate text-xs">
            {item.people} чел. в посещении
          </span>
        </span>
        <span className="text-right text-xs">без сканера</span>
      </div>
    );
  }
  const { record } = item;
  return (
    <Link
      href={arenaHref("agl", item.key)}
      aria-current={isSelected ? "page" : undefined}
      className={cn(
        ROW,
        "hover:bg-muted/60",
        isSelected &&
          "bg-green-50 shadow-[inset_3px_0_0_var(--color-green-500)] dark:bg-green-950",
      )}
    >
      <TimeCell time={item.time} />
      <span className="min-w-0">
        <span className="block truncate font-semibold">{item.boss}</span>
        <span className="block truncate text-xs text-muted-foreground">
          {fightersText(record.fighters)} ·{" "}
          {formatDuration(windowMinutes(record.window))} ·{" "}
          {record.window.scannedBy}
        </span>
      </span>
      <span className="flex flex-col items-end gap-1.5">
        <span className="font-display text-[15px] tabular-nums">
          {formatNumber(record.totalKills)}
        </span>
        <span className="relative block h-1.5 w-full -skew-x-[20deg] overflow-hidden bg-muted">
          <span
            className="absolute inset-y-0 left-0 bg-green-500"
            style={{ width: `${(record.totalKills / maxKills) * 100}%` }}
          />
        </span>
      </span>
    </Link>
  );
}

function TimeCell({
  time,
  isDashed = false,
}: {
  time: string;
  isDashed?: boolean;
}) {
  return (
    <span
      className={cn(
        "-skew-x-12 justify-self-start border px-2.5 py-1",
        isDashed ? "border-dashed" : "bg-muted",
      )}
    >
      <span
        className={cn(
          "inline-block skew-x-12 font-display text-sm",
          isDashed
            ? "text-muted-foreground"
            : "text-green-700 dark:text-green-400",
        )}
      >
        {time}
      </span>
    </span>
  );
}
