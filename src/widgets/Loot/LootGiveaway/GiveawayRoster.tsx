"use client";

import { Heart } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { GiveawayStatusIcon } from "./GiveawayStatusIcon";
import {
  avatarSrc,
  formatDate,
  formatMiscGrant,
  formatWishlistItem,
  type Player,
  type TrackedItem,
} from "./giveawayModel";

function PlayerName({ player }: { player: Player }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-7 shrink-0">
        <AvatarImage src={avatarSrc(player)} alt="" />
        <AvatarFallback className="text-[10px]">
          {player.username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate font-semibold">{player.username}</span>
      {!player.active && (
        <span className="shrink-0 rounded-full border px-1.5 text-[10.5px] text-muted-foreground">
          неактивен
        </span>
      )}
    </span>
  );
}

function Extras({ player }: { player: Player }) {
  if (player.miscGrants.length === 0 && player.wishlist.length === 0)
    return null;
  return (
    <span className="flex flex-wrap gap-1 text-xs">
      {player.miscGrants.map((grant) => (
        <span key={grant.id} className="rounded-full border px-2 py-px">
          {formatMiscGrant(grant)}
        </span>
      ))}
      {player.wishlist.map((wish) => (
        <span
          key={wish.id}
          className="inline-flex items-center gap-1 rounded-full border border-pink-200 bg-pink-50 px-2 py-px text-pink-800 dark:border-pink-500/30 dark:bg-pink-500/10 dark:text-pink-300"
        >
          <Heart className="size-3 fill-current" />
          {formatWishlistItem(wish)}
        </span>
      ))}
    </span>
  );
}

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
      {/* Шапка с иконками прилипает, игроки прокручиваются внутри. */}
      <div className="hidden max-h-[calc(100dvh-var(--give-bar,0px)-2rem)] overflow-auto overscroll-contain @[44rem]/roster:block">
        <table className="w-full border-collapse tabular-nums">
          <thead className="sticky top-0 z-10 bg-muted text-[11px] shadow-[0_1px_0_var(--color-border)] font-semibold tracking-wide text-muted-foreground uppercase">
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
                          <span className="font-mono text-[10px] text-muted-foreground">
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
