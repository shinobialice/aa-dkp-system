import { cn } from "@/shared/lib/tw-merge";
import { attendanceTone } from "@/shared/lib/format";

export function Meter({
  value,
  status,
  label,
}: {
  value: number | null;
  status?: boolean;
  label?: string;
}) {
  const percent = Math.round(value ?? 0);
  const tone = status ? attendanceTone(percent) : null;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span
            className={cn(
              "tabular-nums",
              tone
                ? cn("font-semibold", tone.text)
                : percent === 0 && "text-muted-foreground",
            )}
          >
            {percent}%
          </span>
        </div>
      )}
      <div className={cn("flex items-center gap-2", label && "block")}>
        <span className="relative block h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <span
            className={cn(
              "absolute inset-y-0 left-0 rounded-full",
              tone ? tone.bar : "bg-zinc-400 dark:bg-zinc-500",
            )}
            style={{ width: `${percent}%` }}
          />
        </span>
        {!label && (
          <span
            className={cn(
              "w-9 text-right text-sm tabular-nums",
              tone
                ? cn("font-semibold", tone.text)
                : percent === 0 && "text-muted-foreground",
            )}
          >
            {percent}%
          </span>
        )}
      </div>
    </div>
  );
}
