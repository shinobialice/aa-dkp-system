"use client";

import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { GiveawayStatusIcon } from "./GiveawayStatusIcon";
import { formatDate, type Player, type TrackedItem } from "./giveawayModel";
import PlayerName from "./RosterPlayerName";
import Extras from "./RosterExtras";

export default function GiveawayRoster({
  items,
  players,
  selectedId,
  highlightedName,
  onSelectItem,
  onSelect,
}: {
  items: TrackedItem[];
  players: Player[];
  selectedId: number | null;
  highlightedName: string | null;
  onSelectItem: (name: string | null) => void;
  onSelect: (id: number) => void;
}) {
  const firstGlider = items.findIndex((item) => item.kind === "glider");
  const lootCount = firstGlider < 0 ? items.length : firstGlider;
  const separated = (index: number) => index === 0 || index === firstGlider;

  if (players.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-4 py-12 text-center text-muted-foreground">
        Никого не найдено
      </div>
    );
  }

  return (
    <section
      aria-label="Игроки"
      className="@container/roster min-w-0 overflow-hidden rounded-xl border bg-card"
    >
      <div className="hidden max-h-[calc(100dvh-var(--give-bar,0px)-2rem)] overflow-auto overscroll-contain @[44rem]/roster:block">
        <table className="w-full border-collapse tabular-nums">
          <thead className="sticky top-0 z-10 bg-muted text-2xs shadow-[0_1px_0_var(--color-border)] font-semibold tracking-wide text-muted-foreground uppercase">
            <tr>
              <th />
              <th colSpan={lootCount} className="border-l px-2 pt-2 text-left">
                Лут
              </th>
              {firstGlider >= 0 && (
                <th
                  colSpan={items.length - lootCount}
                  className="border-l px-2 pt-2 text-left"
                >
                  Глайдеры
                </th>
              )}
              <th className="border-l" />
            </tr>
            <tr className="border-b">
              <th className="px-3 py-2 text-left">Игрок</th>
              {items.map((item, index) => (
                <th
                  key={item.name}
                  title={item.name}
                  className={cn(
                    "w-11 px-1 py-2",
                    separated(index) && "border-l",
                    highlightedName === item.name && "bg-foreground/5",
                  )}
                >
                  <button
                    type="button"
                    aria-pressed={highlightedName === item.name}
                    aria-label={`Показать, кто хочет: ${item.name}`}
                    onClick={() =>
                      onSelectItem(
                        highlightedName === item.name ? null : item.name,
                      )
                    }
                    className="mx-auto flex cursor-pointer rounded p-0.5 hover:bg-foreground/10 aria-pressed:ring-2 aria-pressed:ring-foreground"
                  >
                    <LootIcon
                      itemName={item.name}
                      iconUrl={item.iconUrl}
                      grade={item.grade}
                      size={22}
                    />
                  </button>
                </th>
              ))}
              <th className="border-l px-3 py-2 text-left">Прочее и хотелки</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                aria-selected={selectedId === player.id}
                tabIndex={0}
                onClick={() => onSelect(player.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(player.id);
                  }
                }}
                className="cursor-pointer border-b last:border-b-0 hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none aria-selected:bg-green-50 dark:aria-selected:bg-green-500/10"
              >
                <td className="max-w-56 px-3 py-2">
                  <PlayerName player={player} />
                </td>
                {player.items.map((entry, index) => (
                  <td
                    key={entry.name}
                    className={cn(
                      "px-1 py-2 text-center",
                      separated(index) && "border-l",
                      highlightedName === entry.name && "bg-foreground/5",
                    )}
                  >
                    {entry.status ? (
                      <span className="inline-flex flex-col items-center gap-0.5">
                        <GiveawayStatusIcon
                          item={items[index]}
                          status={entry.status}
                          date={entry.date}
                        />
                        {entry.status === "Выдано" && entry.date && (
                          <span className="font-mono text-2xs text-muted-foreground">
                            {formatDate(entry.date, "dd.MM.yy")}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/40">·</span>
                    )}
                  </td>
                ))}
                <td className="border-l px-3 py-2">
                  <span className="block max-w-64">
                    <Extras player={player} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col @[44rem]/roster:hidden">
        {players.map((player) => (
          <button
            key={player.id}
            type="button"
            onClick={() => onSelect(player.id)}
            className="flex cursor-pointer flex-col gap-2 border-b px-3.5 py-3 text-left last:border-b-0 hover:bg-muted/50"
          >
            <PlayerName player={player} />
            <span className="flex flex-wrap items-center gap-1.5">
              {player.items.map((entry, index) => (
                <span key={entry.name} className="contents">
                  {index === firstGlider && (
                    <span className="mx-0.5 h-5 w-px bg-border" />
                  )}
                  <GiveawayStatusIcon
                    item={items[index]}
                    status={entry.status}
                    date={entry.date}
                    tooltip={false}
                  />
                </span>
              ))}
            </span>
            <Extras player={player} />
          </button>
        ))}
      </div>
    </section>
  );
}
