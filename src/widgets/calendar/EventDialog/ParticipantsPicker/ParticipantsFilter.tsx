import { Search } from "lucide-react";
import { Segmented } from "@/shared/ui";
import type { ParticipantFilter } from "./participantsModel";

type Props = {
  filter: ParticipantFilter;
  search: string;
  total: number;
  selectedCount: number;
  onFilterChange: (filter: ParticipantFilter) => void;
  onSearchChange: (search: string) => void;
};

export default function ParticipantsFilter({
  filter,
  search,
  total,
  selectedCount,
  onFilterChange,
  onSearchChange,
}: Props) {
  const options: [ParticipantFilter, string, number][] = [
    ["all", "Все", total],
    ["on", "Отмечены", selectedCount],
    ["off", "Не отмечены", total - selectedCount],
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Segmented
        label="Фильтр участников"
        value={filter}
        onChange={onFilterChange}
        options={options.map(([value, label, count]) => ({
          value,
          label: (
            <>
              {label}
              <span className="text-muted-foreground">{count}</span>
            </>
          ),
        }))}
      />
      <label className="relative flex min-w-40 flex-1 items-center">
        <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Найти игрока"
          aria-label="Найти игрока"
          className="h-9 w-full rounded-lg border bg-background pr-2 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </label>
    </div>
  );
}
