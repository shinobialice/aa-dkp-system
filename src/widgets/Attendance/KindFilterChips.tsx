import { cn } from "@/shared/lib/tw-merge";
import type { KindFilter } from "./attendanceModel";
import { KINDS } from "./raidKinds";

type Props = {
  filter: KindFilter;
  attendedOnly: boolean;
  onFilterChange: (filter: KindFilter) => void;
  onAttendedOnlyChange: (attendedOnly: boolean) => void;
};

export default function KindFilterChips({
  filter,
  attendedOnly,
  onFilterChange,
  onAttendedOnlyChange,
}: Props) {
  return (
    <div className="-mx-4 flex w-[calc(100%+2rem)] gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:w-auto sm:flex-wrap sm:px-0 @[60rem]/att:ml-auto">
      {KINDS.map(({ kind, label, dot }) => (
        <button
          key={kind}
          type="button"
          aria-pressed={filter[kind]}
          onClick={() => onFilterChange({ ...filter, [kind]: !filter[kind] })}
          className={cn(
            "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium whitespace-nowrap transition-colors sm:h-7.5",
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
      <button
        type="button"
        aria-pressed={attendedOnly}
        onClick={() => onAttendedOnlyChange(!attendedOnly)}
        className={cn(
          "inline-flex h-9 shrink-0 cursor-pointer items-center rounded-full border px-2.5 text-xs font-medium whitespace-nowrap transition-colors sm:h-7.5",
          attendedOnly
            ? "border-foreground bg-foreground text-background"
            : "bg-background hover:bg-muted",
        )}
      >
        Где я был
      </button>
    </div>
  );
}
