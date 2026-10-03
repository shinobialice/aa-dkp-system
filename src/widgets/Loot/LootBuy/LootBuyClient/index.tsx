"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/ui";
import LootItemList from "../LootItemList";
import LootQueuePanel, { type QueuePlayer } from "../LootQueuePanel";
import type { BuyItem, QueueEntry, QueueMap } from "../lootBuyModel";
import FilterBar from "./FilterBar";
import MyQueues from "./MyQueues";
import {
  defaultItemName,
  findMyPlaces,
  groupItems,
  type BuyFilters,
} from "./buyFilters";
import { useStickyBar } from "@/hooks/useStickyBar";

const WIDE_LAYOUT_PX = 960;
const SIDE_SHEET_PX = 640;

type Props = {
  initialItems: BuyItem[];
  sources: string[];
  initialQueues: QueueMap;
  players: QueuePlayer[];
  isAdmin: boolean;
  currentUserId: number | null;
};

export default function LootBuyClient({
  initialItems,
  sources,
  initialQueues,
  players,
  isAdmin,
  currentUserId,
}: Props) {
  const [items, setItems] = useState(initialItems);
  const [queues, setQueues] = useState(initialQueues);
  const [filters, setFilters] = useState<BuyFilters>({
    source: null,
    inStockOnly: false,
    search: "",
  });
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetSide, setSheetSide] = useState<"bottom" | "right">("bottom");
  const { containerRef, barRef, sentinelRef, scrollToListTop } =
    useStickyBar("--buy-bar");

  const myPlaces = useMemo(
    () => findMyPlaces(queues, currentUserId),
    [queues, currentUserId],
  );
  const groups = useMemo(
    () => groupItems(items, sources, filters),
    [items, sources, filters],
  );
  const myItems = items.filter((item) => myPlaces[item.name]);
  const activeName = selectedName ?? defaultItemName(items, queues, myItems);
  const selectedItem = items.find((item) => item.name === activeName) ?? null;

  const updateFilters = (patch: Partial<BuyFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    scrollToListTop();
  };

  const selectItem = (name: string) => {
    setSelectedName(name);
    const width = containerRef.current?.clientWidth ?? 0;
    if (width >= WIDE_LAYOUT_PX) return;
    setSheetSide(window.innerWidth >= SIDE_SHEET_PX ? "right" : "bottom");
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
        <h1 className="text-2xl font-bold tracking-tight">Покупка лута</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Цены гильдии, наличие и очереди. Выберите предмет, чтобы увидеть
          очередь.
        </p>
      </div>

      <MyQueues items={myItems} places={myPlaces} onSelect={selectItem} />

      <div ref={sentinelRef} aria-hidden className="-mb-4 h-0" />
      <FilterBar
        barRef={barRef}
        items={items}
        sources={sources}
        filters={filters}
        onChange={updateFilters}
      />

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
