"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Package, Search } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui";
import { LootIcon } from "./icons/LootIconComponent";
import LootItemList, { type ItemGroup, type MyPlace } from "./LootItemList";
import LootQueuePanel, { type QueuePlayer } from "./LootQueuePanel";
import {
  playersCount,
  type BuyItem,
  type QueueEntry,
  type QueueMap,
} from "./lootBuyModel";

const WIDE_LAYOUT_PX = 960;

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors @[60rem]/buy:px-2.5 sm:h-8",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-background text-foreground/80 hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}

export default function LootBuyClient({
  initialItems,
  sources,
  initialQueues,
  players,
  isAdmin,
  currentUserId,
}: {
  initialItems: BuyItem[];
  sources: string[];
  initialQueues: QueueMap;
  players: QueuePlayer[];
  isAdmin: boolean;
  currentUserId: number | null;
}) {
  const [items, setItems] = useState(initialItems);
  const [queues, setQueues] = useState(initialQueues);
  const [source, setSource] = useState<string | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"bottom" | "right">("bottom");
  const containerRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const bar = barRef.current;
    const sentinel = sentinelRef.current;
    if (!container || !bar || !sentinel) return;
    const resize = new ResizeObserver(() => {
      container.style.setProperty("--buy-bar", `${bar.offsetHeight}px`);
    });
    resize.observe(bar);
    const stuck = new IntersectionObserver(([entry]) => {
      bar.dataset.stuck = String(!entry.isIntersecting);
    });
    stuck.observe(sentinel);
    return () => {
      resize.disconnect();
      stuck.disconnect();
    };
  }, []);

  const scrollToListTop = () => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const top = sentinel.getBoundingClientRect().top;
    if (top < 0) window.scrollTo({ top: top + window.scrollY });
  };

  const changeSource = (next: string | null) => {
    setSource(next);
    scrollToListTop();
  };

  const myPlaces = useMemo(() => {
    const places: Record<string, MyPlace> = {};
    if (currentUserId === null) return places;
    for (const [name, entries] of Object.entries(queues)) {
      const index = entries.findIndex(
        (entry) => entry.userId === currentUserId,
      );
      if (index >= 0)
        places[name] = { place: index + 1, total: entries.length };
    }
    return places;
  }, [queues, currentUserId]);

  const groups = useMemo<ItemGroup[]>(() => {
    const term = search.trim().toLowerCase();
    return sources
      .filter((name) => source === null || name === source)
      .map((name) => ({
        source: name,
        items: items.filter(
          (item) =>
            item.source === name &&
            (!inStockOnly || item.stock > 0) &&
            (!term || item.name.toLowerCase().includes(term)),
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [items, sources, source, inStockOnly, search]);

  const myItems = items.filter((item) => myPlaces[item.name]);
  const defaultName =
    myItems[0]?.name ??
    items.find((item) => (queues[item.name]?.length ?? 0) > 0)?.name ??
    items[0]?.name ??
    null;
  const activeName = selectedName ?? defaultName;
  const selectedItem = items.find((item) => item.name === activeName) ?? null;
  const inStockCount = items.filter((item) => item.stock > 0).length;

  const selectItem = (name: string) => {
    setSelectedName(name);
    const width = containerRef.current?.clientWidth ?? 0;
    if (width >= WIDE_LAYOUT_PX) return;
    setSheetSide(window.innerWidth >= 640 ? "right" : "bottom");
    setSheetOpen(true);
  };

  const handleQueueChange = (itemName: string, queue: QueueEntry[]) => {
    setQueues((previous) => ({ ...previous, [itemName]: queue }));
  };

  const handlePriceChange = (itemName: string, price: number | null) => {
    setItems((previous) =>
      previous.map((item) =>
        item.name === itemName ? { ...item, price } : item,
      ),
    );
  };

  const panelProps = selectedItem && {
    item: selectedItem,
    queue: queues[selectedItem.name] ?? [],
    currentUserId,
    isAdmin,
    players,
    onQueueChange: handleQueueChange,
    onPriceChange: handlePriceChange,
  };

  return (
    <div
      ref={containerRef}
      className="@container/buy mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
          Покупка лута
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Цены гильдии, наличие и очереди. Выберите предмет, чтобы увидеть
          очередь.
        </p>
      </div>

      {myItems.length > 0 && (
        <section
          aria-label="Мои очереди"
          className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:px-4 dark:border-green-500/25 dark:bg-green-500/5"
        >
          <span className="text-[13px] font-semibold text-green-700 dark:text-green-400">
            Мои очереди
          </span>
          {myItems.map((item) => {
            const { place, total } = myPlaces[item.name];
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => selectItem(item.name)}
                className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-green-200 bg-background py-1.5 pr-3 pl-1.5 text-left hover:bg-green-50/50 dark:border-green-500/25"
              >
                <LootIcon
                  itemName={item.name}
                  iconUrl={item.icon}
                  grade={item.grade}
                  size={32}
                />
                <span className="flex flex-col leading-tight">
                  <span className="text-[13px] font-semibold">{item.name}</span>
                  <span className="text-xs text-green-800 dark:text-green-300">
                    {place}-е место из {total}
                    {place > 1 && ` · перед вами ${playersCount(place - 1)}`}
                  </span>
                </span>
              </button>
            );
          })}
        </section>
      )}

      <div ref={sentinelRef} aria-hidden className="-mb-4 h-0" />
      <div
        ref={barRef}
        data-stuck="false"
        className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-transparent bg-background/95 px-4 py-2.5 backdrop-blur transition-[border-color,box-shadow] data-[stuck=true]:border-border data-[stuck=true]:shadow-sm sm:-mx-8 sm:px-8 @[60rem]/buy:flex-row @[60rem]/buy:items-center"
      >
        <label className="relative flex w-full shrink-0 items-center @[60rem]/buy:w-52">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              scrollToListTop();
            }}
            placeholder="Поиск предмета"
            aria-label="Поиск предмета"
            className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>
        <div className="-mx-4 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <FilterChip
            active={source === null}
            onClick={() => changeSource(null)}
          >
            Все
            <span className="text-xs text-muted-foreground">
              {items.length}
            </span>
          </FilterChip>
          {sources.map((name) => (
            <FilterChip
              key={name}
              active={source === name}
              onClick={() => changeSource(name)}
            >
              {name}
              <span className="text-xs text-muted-foreground">
                {items.filter((item) => item.source === name).length}
              </span>
            </FilterChip>
          ))}
          <button
            type="button"
            aria-pressed={inStockOnly}
            onClick={() => {
              setInStockOnly((value) => !value);
              scrollToListTop();
            }}
            className={cn(
              "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors @[60rem]/buy:px-2.5 sm:ml-auto sm:h-8",
              inStockOnly
                ? "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
                : "bg-background text-foreground/80 hover:bg-muted",
            )}
          >
            <Package className="size-3.5" />В наличии
            <span className="text-xs text-muted-foreground">
              {inStockCount}
            </span>
          </button>
        </div>
      </div>

      <div className="grid items-start gap-4 @[60rem]/buy:grid-cols-[minmax(0,1fr)_380px]">
        <LootItemList
          groups={groups}
          queues={queues}
          myPlaces={myPlaces}
          selectedName={activeName}
          onSelect={selectItem}
        />
        {panelProps && (
          <aside
            aria-label="Очередь на предмет"
            className="sticky top-[calc(var(--buy-bar,0px)+1rem)] hidden max-h-[calc(100dvh-var(--buy-bar,0px)-2rem)] flex-col overflow-hidden rounded-xl border bg-card @[60rem]/buy:flex"
          >
            <LootQueuePanel
              key={panelProps.item.name}
              {...panelProps}
              scrollQueue
            />
          </aside>
        )}
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side={sheetSide}
          className={cn(
            "gap-0 overflow-y-auto p-0",
            sheetSide === "bottom"
              ? "max-h-[88dvh] rounded-t-2xl"
              : "w-full sm:max-w-md",
          )}
        >
          <SheetTitle className="sr-only">
            {selectedItem ? `Очередь: ${selectedItem.name}` : "Очередь"}
          </SheetTitle>
          <SheetDescription className="sr-only">
            Цена, наличие и очередь на предмет
          </SheetDescription>
          {panelProps && (
            <LootQueuePanel
              key={panelProps.item.name}
              {...panelProps}
              scrollQueue={false}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
