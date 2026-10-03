import { cn } from "@/shared/lib/tw-merge";
import type { ResolvedAttendanceBonus } from "@/utils/attendanceBonusDefaults";

type Props = {
  bonuses: ResolvedAttendanceBonus[];
  activeIds: number[];
  onToggle: (id: number) => void;
};

export default function BonusPicker({ bonuses, activeIds, onToggle }: Props) {
  if (bonuses.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Бонусы
      </span>
      <div className="flex flex-wrap gap-1.5">
        {bonuses.map((bonus) => {
          const active = activeIds.includes(bonus.id);
          return (
            <button
              key={bonus.id}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(bonus.id)}
              className={cn(
                "h-8 cursor-pointer rounded-full border px-3 text-sm font-semibold transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : "bg-background hover:bg-muted",
              )}
            >
              {bonus.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
