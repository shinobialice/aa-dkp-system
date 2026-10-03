import { cn } from "@/shared/lib/tw-merge";

type Props = {
  percent: number;
  className?: string;
  barClassName?: string;
};

export default function MeterBar({ percent, className, barClassName }: Props) {
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
