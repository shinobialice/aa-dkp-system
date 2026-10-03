import * as React from "react";

import { cn } from "@/shared/lib/tw-merge";

function FilterChip({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 text-sm font-medium whitespace-nowrap transition-colors sm:h-8",
        active
          ? "border-foreground bg-foreground text-background"
          : "bg-background text-foreground/80 hover:bg-muted",
        className,
      )}
    >
      {children}
    </button>
  );
}

export { FilterChip };
