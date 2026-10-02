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

/** Строка настройки: название и пояснение слева, поле справа. */
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
            <span className="ml-1.5 text-[11.5px] font-semibold text-amber-700 dark:text-amber-300">
              · изменено
            </span>
          )}
        </label>
        {hint && <p className="text-[12.5px] text-muted-foreground">{hint}</p>}
      </div>
      {children && (
        <div className="flex flex-wrap items-center gap-2">{children}</div>
      )}
    </div>
  );
}

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  disabled,
}: {
  value: T;
  options: { value: T; label: React.ReactNode }[];
  onChange: (value: T) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => onChange(option.value)}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-[13px] font-medium whitespace-nowrap text-muted-foreground hover:text-foreground disabled:cursor-default disabled:opacity-50",
            value === option.value && "bg-background text-foreground shadow-sm",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function Unit({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12.5px] text-muted-foreground">{children}</span>
  );
}

export function Loading() {
  return (
    <div className="rounded-xl border bg-card px-4 py-6 text-sm text-muted-foreground">
      Загрузка…
    </div>
  );
}
