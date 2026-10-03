import { cn } from "@/shared/lib/tw-merge";
import { FILTERS, KIND_META, type JournalFilter } from "./journalMeta";

type Props = {
  filter: JournalFilter;
  onFilterChange: (filter: JournalFilter) => void;
};

export default function JournalFilters({ filter, onFilterChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Фильтр по типу"
    >
      {FILTERS.map((value) => {
        const active = filter === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            onClick={() => onFilterChange(value)}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-medium transition-colors",
              active
                ? "border-foreground bg-foreground text-background"
                : "bg-background hover:bg-accent",
            )}
          >
            {value !== "all" && (
              <span
                className={cn("size-2 rounded-full", KIND_META[value].dot)}
              />
            )}
            {value === "all" ? "Все" : KIND_META[value].label}
          </button>
        );
      })}
    </div>
  );
}
