"use client";

import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { LootIcon } from "./icons/LootIconComponent";
import {
  avatarSrc,
  plural,
  priceLabel,
  type BuyItem,
  type QueueEntry,
} from "./lootBuyModel";

export const GOLD_ICON = "https://archeagecodex.com/items/gold.png";

export type ItemGroup = {
  source: string;
  items: BuyItem[];
};

export type MyPlace = { place: number; total: number };

function StockBadge({ stock }: { stock: number }) {
  return (
    <span
      className={cn(
        "rounded-full px-2 py-px text-[12.5px] font-medium whitespace-nowrap",
        stock > 0
          ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
          : "text-muted-foreground",
      )}
    >
      {stock > 0 ? `${stock} шт.` : "нет"}
    </span>
  );
}

function Price({ item }: { item: BuyItem }) {
  if (item.price === null) {
    return (
      <span className="text-[12.5px] text-muted-foreground">
        {priceLabel(item)}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-foreground tabular-nums">
      <Image src={GOLD_ICON} alt="" width={14} height={14} />
      {priceLabel(item)}
    </span>
  );
}

function QueueFaces({ entries }: { entries: QueueEntry[] }) {
  if (entries.length === 0) {
    return <span className="text-[12.5px] text-muted-foreground">пусто</span>;
  }
  return (
    <span className="flex items-center gap-2">
      <span className="flex -space-x-1.5">
        {entries.slice(0, 3).map((entry) => (
          <Avatar key={entry.id} className="size-[22px] ring-2 ring-background">
            <AvatarImage src={avatarSrc(entry)} alt="" />
            <AvatarFallback className="text-[9px]">
              {entry.username.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
        ))}
      </span>
      <span className="text-[13px] font-semibold tabular-nums">
        {entries.length}
      </span>
    </span>
  );
}

function ItemRow({
  item,
  queue,
  myPlace,
  selected,
  onSelect,
}: {
  item: BuyItem;
  queue: QueueEntry[];
  myPlace: MyPlace | null;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex w-full cursor-pointer items-center gap-3 border-b px-3 py-2 text-left transition-colors last:border-b-0 hover:bg-muted/60 @[40rem]/list:px-3.5",
        selected && "bg-muted shadow-[inset_0_0_0_1.5px_var(--foreground)]",
      )}
    >
      <LootIcon itemName={item.name} iconUrl={item.icon} grade={item.grade} />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="leading-tight font-medium @[40rem]/list:truncate">
          {item.name}
        </span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-muted-foreground @[40rem]/list:hidden">
          <Price item={item} />
          <StockBadge stock={item.stock} />
          {queue.length > 0 && <span>{queue.length} в очереди</span>}
          {myPlace && (
            <span className="font-semibold text-green-700 dark:text-green-400">
              вы {myPlace.place}-е из {myPlace.total}
            </span>
          )}
        </span>
        {myPlace && (
          <span className="hidden text-xs font-medium text-green-700 @[40rem]/list:block dark:text-green-400">
            вы {myPlace.place}-е из {myPlace.total}
          </span>
        )}
      </span>
      <span className="hidden w-28 shrink-0 justify-end @[40rem]/list:flex">
        <Price item={item} />
      </span>
      <span className="hidden w-[76px] shrink-0 justify-center @[40rem]/list:flex">
        <StockBadge stock={item.stock} />
      </span>
      <span className="hidden w-[120px] shrink-0 @[40rem]/list:flex">
        <QueueFaces entries={queue} />
      </span>
    </button>
  );
}

export default function LootItemList({
  groups,
  queues,
  myPlaces,
  selectedName,
  onSelect,
}: {
  groups: ItemGroup[];
  queues: Record<string, QueueEntry[]>;
  myPlaces: Record<string, MyPlace>;
  selectedName: string | null;
  onSelect: (name: string) => void;
}) {
  if (groups.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
        Ничего не найдено
      </p>
    );
  }

  return (
    <div className="@container/list flex min-w-0 flex-col gap-5">
      {groups.map((group) => {
        const inStock = group.items.filter((item) => item.stock > 0).length;
        return (
          <section
            key={group.source}
            aria-label={group.source}
            className="flex flex-col gap-2"
          >
            <div className="flex items-baseline gap-2 px-1">
              <h2 className="text-[15px] font-bold">{group.source}</h2>
              <span className="text-[12.5px] text-muted-foreground">
                {group.items.length}{" "}
                {plural(group.items.length, "предмет", "предмета", "предметов")}
                {inStock > 0 && ` · ${inStock} в наличии`}
              </span>
            </div>
            <div className="overflow-hidden rounded-xl border bg-card">
              <div className="hidden items-center gap-3 border-b bg-muted/50 px-3.5 py-1.5 text-xs font-medium text-muted-foreground @[40rem]/list:flex">
                <span className="flex-1">Предмет</span>
                <span className="w-28 text-right">Цена</span>
                <span className="w-[76px] text-center">Склад</span>
                <span className="w-[120px]">Очередь</span>
              </div>
              {group.items.map((item) => (
                <ItemRow
                  key={item.name}
                  item={item}
                  queue={queues[item.name] ?? []}
                  myPlace={myPlaces[item.name] ?? null}
                  selected={item.name === selectedName}
                  onSelect={() => onSelect(item.name)}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
