import type { Ref } from "react";
import { Package, Search } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { FilterChip } from "@/shared/ui";
import type { BuyItem } from "../lootBuyModel";
import type { BuyFilters } from "./buyFilters";

type Props = {
  barRef: Ref<HTMLDivElement>;
  items: BuyItem[];
  sources: string[];
  filters: BuyFilters;
  onChange: (patch: Partial<BuyFilters>) => void;
};

export default function FilterBar({
  barRef,
  items,
  sources,
  filters,
  onChange,
}: Props) {
  const inStockCount = items.filter((item) => item.stock > 0).length;

  return (
    <div
      ref={barRef}
      data-stuck="false"
      className="sticky top-0 z-20 -mx-4 flex flex-col gap-2 border-b border-transparent bg-background/95 px-4 py-2.5 backdrop-blur transition-[border-color,box-shadow] data-[stuck=true]:border-border data-[stuck=true]:shadow-sm sm:-mx-8 sm:px-8 @[60rem]/buy:flex-row @[60rem]/buy:items-center"
    >
      <label className="relative flex w-full shrink-0 items-center @[60rem]/buy:w-52">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Поиск предмета"
          aria-label="Поиск предмета"
          className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </label>
      <div className="-mx-4 flex min-w-0 flex-1 gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        <FilterChip
          active={filters.source === null}
          onClick={() => onChange({ source: null })}
        >
          Все
          <span className="text-xs text-muted-foreground">{items.length}</span>
        </FilterChip>
        {sources.map((name) => (
          <FilterChip
            key={name}
            active={filters.source === name}
            onClick={() => onChange({ source: name })}
          >
            {name}
            <span className="text-xs text-muted-foreground">
              {items.filter((item) => item.source === name).length}
            </span>
          </FilterChip>
        ))}
        <FilterChip
          active={filters.inStockOnly}
          onClick={() => onChange({ inStockOnly: !filters.inStockOnly })}
          className={cn(
            "sm:ml-auto",
            filters.inStockOnly &&
              "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300",
          )}
        >
          <Package className="size-3.5" />В наличии
          <span className="text-xs text-muted-foreground">{inStockCount}</span>
        </FilterChip>
      </div>
    </div>
  );
}
