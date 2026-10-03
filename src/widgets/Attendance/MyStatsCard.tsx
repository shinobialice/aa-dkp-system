import { cn } from "@/shared/lib/tw-merge";
import { formatDay, percent, type MyStats } from "./attendanceModel";
import { raidTitle } from "./raidKinds";

const MISSED_SHOWN = 3;
const GOOD_PERCENT = 50;

type Props = {
  title: string;
  stats: MyStats;
};

export default function MyStatsCard({ title, stats }: Props) {
  const missed = stats.missedPrimes
    .slice(0, MISSED_SHOWN)
    .map(
      (raid) =>
        `${raidTitle(raid)}, ${formatDay(raid.start.slice(0, 10), { day: "numeric", month: "short" })}`,
    );
  const hiddenMissed = stats.missedPrimes.length - MISSED_SHOWN;

  return (
    <section
      aria-label={title}
      className="flex flex-col gap-2.5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-green-500/25 dark:bg-green-500/5"
    >
      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
        {title}
      </span>
      <div className="flex flex-col gap-3 @[40rem]/att:flex-row @[40rem]/att:gap-6">
        <StatBar label="Праймы" {...stats.primes} />
        <StatBar label="АГЛ, Кошка, Морф, Марли" {...stats.others} />
      </div>
      {missed.length > 0 && (
        <span className="text-xs text-green-800 dark:text-green-300">
          Пропущен{missed.length > 1 ? "ы" : ""}: {missed.join("; ")}
          {hiddenMissed > 0 && ` и ещё ${hiddenMissed}`}
        </span>
      )}
    </section>
  );
}

type StatBarProps = {
  label: string;
  attended: number;
  total: number;
};

function StatBar({ label, attended, total }: StatBarProps) {
  const value = percent(attended, total);
  const good = value >= GOOD_PERCENT;

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs text-foreground/80">{label}</span>
        <span className="shrink-0 text-base font-bold tabular-nums">
          {attended} из {total}{" "}
          <span
            className={cn(
              "text-xs font-semibold",
              good
                ? "text-green-700 dark:text-green-400"
                : "text-amber-700 dark:text-amber-400",
            )}
          >
            {value}%
          </span>
        </span>
      </span>
      <span className="block h-1.5 overflow-hidden rounded-full bg-green-100 dark:bg-green-500/15">
        <span
          className={cn(
            "block h-full rounded-full",
            good ? "bg-green-600" : "bg-amber-500",
          )}
          style={{ width: `${value}%` }}
        />
      </span>
    </div>
  );
}
