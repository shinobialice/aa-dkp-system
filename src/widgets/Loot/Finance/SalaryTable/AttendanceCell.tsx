import { attendanceTone } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import type { SalaryEntry } from "../financeModel";

type Props = {
  row: SalaryEntry;
};

export default function AttendanceCell({ row }: Props) {
  const tone = attendanceTone(row.totalPercent);

  return (
    <span className="flex flex-col gap-1">
      <span className="flex items-baseline justify-between gap-2 text-sm">
        <span className={cn("font-semibold tabular-nums", tone.text)}>
          {Math.round(row.totalPercent)}%
        </span>
        <span className="text-2xs text-muted-foreground tabular-nums">
          П {Math.round(row.primePercent)} · А {Math.round(row.aglPercent)}
        </span>
      </span>
      <span className="relative block h-1 overflow-hidden rounded-full bg-muted">
        <span
          className={cn("absolute inset-y-0 left-0 rounded-full", tone.bar)}
          style={{ width: `${Math.min(100, row.totalPercent)}%` }}
        />
      </span>
    </span>
  );
}
