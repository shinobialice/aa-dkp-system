import { cn } from "@/shared/lib/tw-merge";
import { classColors } from "./classStyles";

export type ClassChip = { name: string | null; label: string; count: number };

type Props = {
  chips: ClassChip[];
  active: string | null;
  onChange: (name: string | null) => void;
};

export default function ClassChips({ chips, active, onChange }: Props) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Фильтр по классу"
    >
      {chips.map((chip) => {
        const isActive = active === chip.name;
        return (
          <button
            key={chip.label}
            type="button"
            aria-pressed={isActive}
            onClick={() => {
              onChange(isActive ? null : chip.name);
            }}
            className={cn(
              "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-medium transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "bg-background hover:bg-accent",
            )}
          >
            {chip.name && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: classColors[chip.name] }}
              />
            )}
            {chip.label}
            <span
              className={cn(
                "tabular-nums",
                isActive ? "text-background/70" : "text-muted-foreground",
              )}
            >
              {chip.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
