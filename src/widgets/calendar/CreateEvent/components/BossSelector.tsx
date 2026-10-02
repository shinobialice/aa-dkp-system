import React from "react";
import { cn } from "@/shared/lib/tw-merge";
import { bossColorStyle } from "@/widgets/Attendance/attendanceModel";

const AGL_BOSS_ORDER = ["АГЛ", "Морф", "Марли Прок", "Кошка"];

export default function BossSelector({
  category,
  bosses,
  selectedBoss,
  onSelectBoss,
  errors,
}: {
  category: string | null;
  bosses: any[];
  selectedBoss: string | null;
  onSelectBoss: (boss: any) => void;
  errors: { selectedBoss: boolean };
}) {
  if (category !== "Прайм" && category !== "АГЛ") return null;

  const options =
    category === "Прайм"
      ? bosses.filter((boss) => boss.category === "Прайм")
      : AGL_BOSS_ORDER.map((name) =>
          bosses.find(
            (boss) =>
              boss.boss_name.trim().toLowerCase() === name.toLowerCase(),
          ),
        ).filter(Boolean);

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-muted-foreground">
        Босс
      </span>
      <div
        role="radiogroup"
        aria-label="Босс"
        className="flex flex-wrap gap-1.5"
      >
        {options.map((boss: any) => {
          const selected = selectedBoss === boss.boss_name;
          return (
            <button
              key={boss.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onSelectBoss(boss)}
              style={bossColorStyle(boss.boss_name, category)}
              className={cn(
                "h-[34px] cursor-pointer rounded-full border px-3 text-[13px] font-bold transition-colors",
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
      {errors.selectedBoss && (
        <p className="text-xs text-destructive">Выберите босса</p>
      )}
    </div>
  );
}
