import { cn } from "@/shared/lib/tw-merge";
import type { EventKind, KindFilter } from "./scheduleModel";

const FILTERS: { kind: EventKind; label: string; dot: string }[] = [
  { kind: "prime", label: "Праймы", dot: "bg-red-600" },
  { kind: "event", label: "Ивенты", dot: "bg-stone-500" },
  { kind: "agl", label: "АГЛ и Кошка", dot: "bg-zinc-400" },
];

type Props = {
  filter: KindFilter;
  onToggle: (kind: EventKind) => void;
};

export default function KindFilters({ filter, onToggle }: Props) {
  return (
    <div
      role="group"
      aria-label="Что показывать"
      className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
    >
      {FILTERS.map(({ kind, label, dot }) => (
        <button
          key={kind}
          type="button"
          aria-pressed={filter[kind]}
          onClick={() => onToggle(kind)}
          className={cn(
            "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors sm:h-8",
            filter[kind]
              ? "bg-background text-foreground"
              : "bg-muted/50 text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              dot,
              !filter[kind] && "opacity-0",
            )}
          />
          {label}
        </button>
      ))}
    </div>
  );
}
