import * as React from "react";

import { cn } from "@/shared/lib/tw-merge";

function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  disabled,
  className,
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-muted p-[3px] [scrollbar-width:none]",
        className,
      )}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "inline-flex h-8 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground disabled:cursor-default disabled:opacity-50 sm:h-7",
            value === option.value &&
              "bg-background text-foreground shadow-sm dark:bg-input/30",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export { Segmented };
