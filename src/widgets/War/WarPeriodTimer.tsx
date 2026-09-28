import WarLiveDuration, { formatDuration } from "./WarLiveDuration";

function formatMoscowDate(iso: string, withYear: boolean): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    ...(withYear && { year: "numeric" }),
    timeZone: "Europe/Moscow",
  }).format(new Date(iso));
}

function moscowYear(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    timeZone: "Europe/Moscow",
  }).format(new Date(iso));
}

export function formatStartDate(iso: string): string {
  return formatMoscowDate(iso, true);
}

export function formatDateRange(startIso: string, endIso: string): string {
  const sameYear = moscowYear(startIso) === moscowYear(endIso);
  return `с ${formatMoscowDate(startIso, !sameYear)} по ${formatStartDate(endIso)}`;
}

export default function WarPeriodTimer({
  label,
  startedAt,
  endedAt = null,
}: {
  label: string;
  startedAt: string;
  endedAt?: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {endedAt ? (
        <span className="text-lg font-semibold tabular-nums">
          {formatDuration(
            new Date(startedAt).getTime(),
            new Date(endedAt).getTime(),
          )}
        </span>
      ) : (
        <WarLiveDuration startedAt={startedAt} />
      )}
      <span className="text-xs text-muted-foreground">
        {endedAt
          ? formatDateRange(startedAt, endedAt)
          : `с ${formatStartDate(startedAt)}`}
      </span>
    </div>
  );
}
