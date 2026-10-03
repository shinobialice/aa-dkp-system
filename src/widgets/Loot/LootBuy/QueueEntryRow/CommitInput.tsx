import type { KeyboardEvent } from "react";
import { cn } from "@/shared/lib/tw-merge";

export default function CommitInput({
  label,
  value,
  type = "number",
  placeholder,
  className,
  onCommit,
}: {
  label: string;
  value: string;
  type?: "number" | "text";
  placeholder?: string;
  className?: string;
  onCommit: (value: string) => void;
}) {
  const commit = (next: string) => {
    if (next !== value) onCommit(next);
  };
  return (
    <input
      key={value}
      type={type}
      aria-label={label}
      defaultValue={value}
      placeholder={placeholder}
      onBlur={(event) => commit(event.currentTarget.value)}
      onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") event.currentTarget.blur();
      }}
      className={cn(
        "h-8 min-w-0 rounded-md border bg-background px-2 text-sm tabular-nums outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40",
        className,
      )}
    />
  );
}
