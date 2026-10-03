import { X } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";

export type Entry = { id: number; amount: number; reason: string };

export default function Row({
  title,
  hint,
  value,
  positive,
  onRemove,
}: {
  title: string;
  hint: string;
  value: string;
  positive: boolean | null;
  onRemove?: () => void;
}) {
  return (
    <li className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto_32px] items-center gap-2.5 border-t border-border/60 px-2.5 py-1.5">
      <div className="min-w-0">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{hint}</div>
      </div>
      <span className={cn("font-bold tabular-nums", valueTone(positive))}>
        {value}
      </span>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Убрать: ${title}`}
          className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground/70 transition-colors hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      ) : (
        <span />
      )}
    </li>
  );
}

function valueTone(positive: boolean | null) {
  if (positive === null) return "text-muted-foreground";
  return positive
    ? "text-green-700 dark:text-green-400"
    : "text-red-700 dark:text-red-400";
}
