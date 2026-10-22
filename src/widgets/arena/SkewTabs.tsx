import { cn } from "@/shared/lib/tw-merge";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  tone?: "surface" | "banner";
  className?: string;
};

const TONES = {
  surface: {
    active: "bg-primary text-primary-foreground",
    idle: "bg-muted text-muted-foreground hover:text-foreground",
  },
  banner: {
    active: "bg-white text-[#0b1a12]",
    idle: "bg-white/10 text-white/80 hover:bg-white/20",
  },
};

export default function SkewTabs<T extends string>({
  options,
  value,
  onChange,
  label,
  tone = "surface",
  className,
}: Props<T>) {
  const colors = TONES[tone];

  return (
    <div
      role="tablist"
      aria-label={label}
      className={cn("flex gap-1", className)}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.value)}
            className={cn(
              "arena-skew h-8 flex-1 cursor-pointer px-3.5 font-display text-xs tracking-wide whitespace-nowrap uppercase transition-colors sm:flex-none",
              isActive ? colors.active : colors.idle,
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
