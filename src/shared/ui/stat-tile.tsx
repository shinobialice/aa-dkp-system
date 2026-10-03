import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/shared/lib/tw-merge";

function StatTile({
  label,
  icon: Icon,
  swatch,
  hint,
  className,
  children,
}: {
  label: React.ReactNode;
  icon?: LucideIcon;
  swatch?: string;
  hint?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-1 rounded-xl border bg-card px-3.5 py-3",
        className,
      )}
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {Icon && <Icon className="size-3.5 shrink-0" />}
        {swatch && (
          <span
            className="size-2.5 shrink-0 rounded-sm"
            style={{ backgroundColor: swatch }}
          />
        )}
        {label}
      </span>
      <span className="flex items-baseline gap-1.5 text-2xl font-bold tracking-tight tabular-nums">
        {children}
      </span>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}

function StatUnit({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-sm font-medium tracking-normal text-muted-foreground">
      {children}
    </span>
  );
}

export { StatTile, StatUnit };
