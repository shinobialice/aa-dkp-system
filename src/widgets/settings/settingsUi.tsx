"use client";

import { cn } from "@/shared/lib/tw-merge";

export function SettingsCard({
  title,
  hint,
  action,
  children,
  className,
}: {
  title?: React.ReactNode;
  hint?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "min-w-0 overflow-hidden rounded-xl border bg-card",
        className,
      )}
    >
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
          <h3 className="font-semibold">
            {title}
            {hint && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {hint}
              </span>
            )}
          </h3>
          {action}
        </div>
      )}
      <div className="divide-y">{children}</div>
    </section>
  );
}

export function SettingRow({
  title,
  hint,
  changed,
  children,
  htmlFor,
}: {
  title: React.ReactNode;
  hint?: React.ReactNode;
  changed?: boolean;
  children?: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-x-5 gap-y-2.5 px-4 py-3",
        changed && "bg-amber-50 dark:bg-amber-500/10",
      )}
    >
      <div className="min-w-0 flex-[1_1_11rem]">
        <label htmlFor={htmlFor} className="block font-medium">
          {title}
          {changed && (
            <span className="ml-1.5 text-2xs font-semibold text-amber-700 dark:text-amber-300">
              · изменено
            </span>
          )}
        </label>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

export function Unit({ children }: { children: React.ReactNode }) {
  return <span className="text-xs text-muted-foreground">{children}</span>;
}

export function Loading() {
  return (
    <div className="rounded-xl border bg-card px-4 py-6 text-sm text-muted-foreground">
      Загрузка…
    </div>
  );
}
