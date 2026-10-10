import type { Ref } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { FilterChip, Switch } from "@/shared/ui";
import type { RosterFilter } from "./giveawayModel";
import { FILTERS, type RosterQuery } from "./rosterFilters";

type Props = {
  barRef: Ref<HTMLDivElement>;
  query: RosterQuery;
  counts: Record<RosterFilter, number>;
  onChange: (patch: Partial<RosterQuery>) => void;
};

export default function GiveawayFilterBar({
  barRef,
  query,
  counts,
  onChange,
}: Props) {
  return (
    <div
      ref={barRef}
      data-stuck="false"
      className="sticky top-(--app-header) z-20 -mx-4 flex flex-col gap-2 border-b border-transparent bg-background/95 px-4 py-2.5 backdrop-blur transition-[border-color,box-shadow] data-[stuck=true]:border-border data-[stuck=true]:shadow-sm sm:-mx-8 sm:px-8 lg:flex-row lg:items-center"
    >
      <label className="relative flex w-full shrink-0 items-center lg:w-52">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          value={query.search}
          onChange={(event) => onChange({ search: event.target.value })}
          placeholder="Поиск по нику"
          aria-label="Поиск по нику"
          className="h-10 w-full rounded-lg border bg-background pr-3 pl-9 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </label>
      <div className="-mx-4 flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {query.itemName && (
          <FilterChip
            active={false}
            onClick={() => onChange({ itemName: null })}
            className="border-dashed bg-muted"
          >
            {query.itemName} ✕
          </FilterChip>
        )}
        {FILTERS.map(({ key, label }) => (
          <FilterChip
            key={key}
            active={query.filter === key}
            onClick={() => onChange({ filter: key })}
          >
            {label}
            <span
              className={cn(
                "text-xs",
                query.filter === key
                  ? "text-background/70"
                  : "text-muted-foreground",
              )}
            >
              {counts[key]}
            </span>
          </FilterChip>
        ))}
        <label className="ml-auto flex shrink-0 cursor-pointer items-center gap-2 pl-2 text-sm whitespace-nowrap text-muted-foreground">
          <Switch
            className="cursor-pointer"
            checked={query.showInactive}
            onCheckedChange={(showInactive) => onChange({ showInactive })}
          />
          Неактивные и АФК
        </label>
      </div>
    </div>
  );
}
