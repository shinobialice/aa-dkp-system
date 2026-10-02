"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";

export const SCROLL_LIST = "overflow-y-auto [scrollbar-width:thin]";

export function WarSection({
  title,
  icon: Icon,
  description,
  action,
  className,
  children,
}: {
  title: string;
  icon?: LucideIcon;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={title}
      className={cn(
        "flex min-w-0 flex-col rounded-xl border bg-card",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-[15px] font-semibold">
            {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function SectionEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="mx-4 mb-4 rounded-lg border border-dashed px-3 py-6 text-center text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export function MeterBar({
  percent,
  className,
  barClassName,
}: {
  percent: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <span
      className={cn(
        "relative block h-1 w-full overflow-hidden rounded-full bg-muted",
        className,
      )}
    >
      <span
        className={cn("absolute inset-y-0 left-0 rounded-full", barClassName)}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </span>
  );
}

export function PlaceNumber({ place }: { place: number }) {
  return (
    <span
      className={cn(
        "tabular-nums",
        place <= 3
          ? "font-bold text-foreground"
          : "font-medium text-muted-foreground",
      )}
    >
      {place}
    </span>
  );
}

export function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex gap-0.5 rounded-lg bg-muted p-[3px]",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 flex-1 cursor-pointer rounded-md px-3 text-sm whitespace-nowrap transition-colors",
              active
                ? "bg-background font-semibold text-foreground shadow-sm dark:bg-input/30"
                : "font-medium text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function KpiTile({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string | null;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-xl border bg-card px-4 py-3.5 sm:px-[18px] sm:py-4">
      <div className="flex items-start gap-2 text-[13px] leading-tight font-medium text-muted-foreground">
        <Icon className="size-4 shrink-0" />
        <span className="min-w-0">{label}</span>
      </div>
      <div className="text-[22px] leading-tight font-bold tracking-tight tabular-nums sm:text-[28px]">
        {value}
      </div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  );
}
