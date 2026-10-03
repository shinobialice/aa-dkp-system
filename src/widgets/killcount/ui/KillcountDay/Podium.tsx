import { cn } from "@/shared/lib/tw-merge";
import { honor, kills, type KillRow } from "../killcountModel";
import { formatNumber } from "@/shared/lib/format";
import PlayerAvatar from "./PlayerAvatar";
import ClassBadge from "./ClassBadge";
import PlayerName from "./PlayerName";

const PODIUM = [
  {
    medal: "bg-amber-400 text-amber-950",
    card: "border-amber-300 bg-gradient-to-b from-amber-50 to-card pt-6 dark:border-amber-500/40 dark:from-amber-500/10",
    avatar: "size-16 sm:size-18",
  },
  {
    medal: "bg-zinc-300 text-zinc-800",
    card: "",
    avatar: "size-12 sm:size-14",
  },
  {
    medal: "bg-orange-300 text-orange-950",
    card: "",
    avatar: "size-12 sm:size-14",
  },
];

export default function Podium({ rows }: { rows: KillRow[] }) {
  const order = [1, 0, 2].filter((place) => rows[place]);
  return (
    <section
      aria-label="Топ-3"
      className={cn(
        "grid items-end gap-2.5 pt-3",
        order.length === 3 ? "grid-cols-3" : "grid-cols-2 sm:grid-cols-3",
      )}
    >
      {order.map((place) => {
        const row = rows[place];
        const style = PODIUM[place];
        return (
          <div
            key={row.id}
            className={cn(
              "relative flex min-w-0 flex-col items-center gap-1.5 rounded-2xl border bg-card px-2 py-3.5 text-center",
              style.card,
            )}
          >
            <span
              className={cn(
                "absolute -top-3 grid size-6 place-items-center rounded-full border-2 border-card text-xs font-extrabold",
                style.medal,
              )}
            >
              {place + 1}
            </span>
            <PlayerAvatar row={row} className={style.avatar} />
            <span className="flex max-w-full min-w-0 text-sm sm:text-base">
              <PlayerName row={row} />
            </span>
            <ClassBadge row={row} />
            <span className="text-2xl leading-none font-extrabold text-red-600 tabular-nums dark:text-red-400">
              {kills(row)}{" "}
              <span className="text-xs font-semibold text-muted-foreground">
                килов
              </span>
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatNumber(honor(row))} хонора
            </span>
          </div>
        );
      })}
    </section>
  );
}
