import { cn } from "@/shared/lib/tw-merge";
import { attendanceTone } from "@/shared/lib/format";

export default function StatTile({
  label,
  value,
  percent,
  colored,
}: {
  label: string;
  value: string;
  percent: number;
  colored: boolean;
}) {
  const colors = colored
    ? attendanceTone(percent)
    : { text: "", bar: "bg-muted-foreground/50" };
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3.5 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-xl font-bold tabular-nums sm:text-2xl",
          colors.text,
        )}
      >
        {value}
      </span>
      <span className="relative block h-1.5 overflow-hidden rounded-full bg-border/70">
        <span
          className={cn("absolute inset-y-0 left-0 rounded-full", colors.bar)}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </span>
    </div>
  );
}
