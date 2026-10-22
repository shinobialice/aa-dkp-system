import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  title: string;
  meta?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export default function ArenaPanel({
  title,
  meta,
  action,
  className,
  children,
}: Props) {
  return (
    <section
      aria-label={title}
      className={cn(
        "arena-cut flex min-w-0 flex-col gap-4 border bg-card p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h2 className="font-display text-lg tracking-wide uppercase">
            {title}
          </h2>
          {meta && (
            <span className="text-xs text-muted-foreground">{meta}</span>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
