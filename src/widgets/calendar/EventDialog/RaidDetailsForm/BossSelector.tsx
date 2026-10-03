import type { Boss } from "@/actions/getBosses";
import { cn } from "@/shared/lib/tw-merge";
import { bossColorStyle } from "@/widgets/Attendance/raidKinds";

const AGL_BOSS_ORDER = ["АГЛ", "Морф", "Марли Прок", "Кошка"];

type Props = {
  category: string | null;
  bosses: Boss[];
  selectedBoss: string | null;
  hasError: boolean;
  onSelect: (boss: Boss) => void;
};

export default function BossSelector({
  category,
  bosses,
  selectedBoss,
  hasError,
  onSelect,
}: Props) {
  if (category !== "Прайм" && category !== "АГЛ") return null;

  const options = bossOptions(category, bosses);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">Босс</span>
      <div
        role="radiogroup"
        aria-label="Босс"
        className="flex flex-wrap gap-1.5"
      >
        {options.map((boss) => {
          const selected = selectedBoss === boss.boss_name;
          return (
            <button
              key={boss.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelect(boss)}
              style={bossColorStyle(boss.boss_name, category)}
              className={cn(
                "h-8.5 cursor-pointer rounded-full border px-3 text-sm font-bold transition-colors",
                selected
                  ? "border-transparent bg-[var(--raid-color)] text-white dark:bg-[var(--raid-color-dark)] dark:text-zinc-950"
                  : "bg-background text-[var(--raid-color)] hover:bg-muted dark:text-[var(--raid-color-dark)]",
              )}
            >
              {boss.boss_name}
            </button>
          );
        })}
      </div>
      {hasError && <p className="text-xs text-destructive">Выберите босса</p>}
    </div>
  );
}

function bossOptions(category: "Прайм" | "АГЛ", bosses: Boss[]) {
  if (category === "Прайм") {
    return bosses.filter((boss) => boss.category === "Прайм");
  }
  return AGL_BOSS_ORDER.map((name) =>
    bosses.find(
      (boss) => boss.boss_name.trim().toLowerCase() === name.toLowerCase(),
    ),
  ).filter((boss): boss is Boss => boss !== undefined);
}
