import { cn } from "@/shared/lib/tw-merge";
import type { KillCountHistoryData } from "../types";
import { dayKey } from "./killcountModel";

export const dayHref = (day: KillCountHistoryData) =>
  `/kill-counter/history/${dayKey(day.date)}`;

export default function WarChip({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "flex max-w-80 min-w-44 shrink-0 cursor-pointer flex-col gap-0.5 rounded-xl border bg-card px-3 py-2 text-left transition-colors hover:border-foreground/25",
        active && "border-foreground ring-1 ring-foreground",
      )}
    >
      <span className="truncate text-sm font-semibold">{title}</span>
      <span className="text-2xs text-muted-foreground">{children}</span>
    </button>
  );
}
