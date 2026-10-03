import { cn } from "@/shared/lib/tw-merge";
import type { OpponentStatus, OpponentView } from "./opponentsModel";
import { formatDayMonth, formatShortDate, formatSpan } from "./warModel";

const STATUS_LABEL: Record<OpponentStatus, string> = {
  active: "Идёт",
  ended: "Слились",
  periodEnd: "До конца вара",
};

type Props = {
  opponent: OpponentView;
  now: number | null;
};

export default function OpponentTile({ opponent, now }: Props) {
  const active = opponent.status === "active";
  const endMs = opponent.endedAt ? new Date(opponent.endedAt).getTime() : now;
  const duration =
    opponent.startedAt && endMs !== null
      ? formatSpan(opponent.startedAt, endMs)
      : null;
  const since = sinceLabel(opponent);
  const tone = active
    ? "text-red-700 dark:text-red-400"
    : "text-muted-foreground";

  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-lg bg-muted/50 px-3 py-2.5 sm:px-4 sm:py-3.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">против</span>
        <span
          className={cn(
            "hidden items-center gap-1.5 text-xs font-semibold sm:inline-flex",
            tone,
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              active ? "bg-red-600" : "bg-muted-foreground/60",
            )}
          />
          {STATUS_LABEL[opponent.status]}
        </span>
      </div>
      <span
        className={cn(
          "truncate text-lg leading-tight font-bold sm:text-xl",
          tone,
        )}
      >
        {opponent.name}
      </span>
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-1.5">
        {duration && (
          <span className="font-semibold tabular-nums sm:text-base">
            {duration}
          </span>
        )}
        {since && (
          <span className="text-xs text-muted-foreground">{since}</span>
        )}
      </div>
    </div>
  );
}

function sinceLabel({ startedAt, endedAt, status }: OpponentView) {
  if (!startedAt) return null;
  if (status === "ended" && endedAt) {
    return `${formatShortDate(startedAt)} — ${formatShortDate(endedAt)}`;
  }
  return `с ${formatDayMonth(startedAt)}`;
}
