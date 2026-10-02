import React from "react";
import { cn } from "@/shared/lib/tw-merge";

const CATEGORIES = ["Прайм", "АГЛ"];

export default function CategorySelector({
  category,
  setCategory,
  setSelectedBoss,
  setSelectedBosses,
  setActiveBonusIds,
  setErrors,
  errors,
}: {
  category: string | null;
  setCategory: (value: string | null) => void;
  setSelectedBoss: (value: string | null) => void;
  setSelectedBosses: React.Dispatch<React.SetStateAction<any[]>>;
  setActiveBonusIds: React.Dispatch<
    React.SetStateAction<Record<number, boolean>>
  >;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: { category: boolean };
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12.5px] font-semibold text-muted-foreground">
        Тип
      </span>
      <div
        role="radiogroup"
        aria-label="Тип"
        className={cn(
          "grid grid-cols-2 gap-0.5 rounded-lg bg-muted p-[3px]",
          errors.category && "ring-2 ring-destructive/60",
        )}
      >
        {CATEGORIES.map((value) => (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={category === value}
            onClick={() => {
              if (category === value) return;
              setCategory(value);
              setSelectedBoss(null);
              setSelectedBosses([]);
              setActiveBonusIds({});
              setErrors((prev: any) => ({ ...prev, category: false }));
            }}
            className={cn(
              "h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors",
              category === value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {value}
          </button>
        ))}
      </div>
      {errors.category && (
        <p className="text-xs text-destructive">Выберите тип рейда</p>
      )}
    </div>
  );
}
