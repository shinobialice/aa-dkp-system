"use client";

import { Check, Circle, Heart } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { STATUS_STYLES } from "./GiveawayStatusIcon";
import type { StatusCounts, TrackedItem } from "./giveawayModel";

function Count({
  value,
  className,
  title,
  children,
}: {
  value: number;
  className: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <span
      title={title}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-px text-[11px] font-semibold tabular-nums",
        className,
        value === 0 && "opacity-45",
      )}
    >
      {children}
      {value}
    </span>
  );
}

export default function GiveawayItemTiles({
  items,
  counts,
  selectedName,
  onSelect,
}: {
  items: TrackedItem[];
  counts: Record<string, StatusCounts>;
  selectedName: string | null;
  onSelect: (name: string | null) => void;
}) {
  return (
    <section aria-label="Предметы" className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Предметы
        </h2>
        <span className="text-xs text-muted-foreground">
          нажмите, чтобы отфильтровать
        </span>
      </div>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-[repeat(auto-fill,minmax(150px,1fr))] sm:overflow-visible sm:px-0">
        {items.map((item) => {
          const c = counts[item.name];
          const active = selectedName === item.name;
          return (
            <button
              key={item.name}
              type="button"
              aria-pressed={active}
              onClick={() => onSelect(active ? null : item.name)}
              className={cn(
                "flex w-[150px] shrink-0 cursor-pointer flex-col gap-2 rounded-xl border bg-card p-2.5 text-left transition-colors hover:border-foreground/25 sm:w-auto",
                active && "border-foreground ring-1 ring-foreground",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <LootIcon
                  itemName={item.name}
                  iconUrl={item.iconUrl}
                  grade={item.grade}
                  size={32}
                />
                <span className="flex min-w-0 flex-col">
                  <span className="line-clamp-2 text-[12.5px] leading-tight font-semibold">
                    {item.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {item.kind === "glider" ? "Глайдер" : "Лут"}
                  </span>
                </span>
              </span>
              <span className="flex flex-wrap gap-1">
                <Count
                  value={c.given}
                  title="выдано гильдией"
                  className={STATUS_STYLES["Выдано"].badge}
                >
                  <Check className="size-3" strokeWidth={3} />
                </Count>
                <Count
                  value={c.stock}
                  title="в наличии — уже есть, гильдия не выдавала"
                  className={STATUS_STYLES["В наличии"].badge}
                >
                  <Circle className="size-2 fill-current" />
                </Count>
                <Count
                  value={c.want}
                  title="хотят"
                  className={STATUS_STYLES["Хочет"].badge}
                >
                  <Heart className="size-3 fill-current" />
                </Count>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
