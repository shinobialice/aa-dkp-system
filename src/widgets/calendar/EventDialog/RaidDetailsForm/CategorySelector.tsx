import { cn } from "@/shared/lib/tw-merge";

const CATEGORIES = ["Прайм", "АГЛ"];

type Props = {
  value: string | null;
  hasError: boolean;
  onChange: (category: string) => void;
};

export default function CategorySelector({ value, hasError, onChange }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">Тип</span>
      <div
        role="radiogroup"
        aria-label="Тип"
        className={cn(
          "grid grid-cols-2 gap-0.5 rounded-lg bg-muted p-0.75",
          hasError && "ring-2 ring-destructive/60",
        )}
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="radio"
            aria-checked={value === category}
            onClick={() => onChange(category)}
            className={cn(
              "h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors",
              value === category
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {category}
          </button>
        ))}
      </div>
      {hasError && (
        <p className="text-xs text-destructive">Выберите тип рейда</p>
      )}
    </div>
  );
}
