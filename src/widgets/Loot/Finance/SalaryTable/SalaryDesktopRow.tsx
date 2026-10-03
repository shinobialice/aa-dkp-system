import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { GoldAmount } from "@/shared/ui";
import { remaining, type SalaryEntry } from "../financeModel";
import AdvanceControls, { type AdvanceHandlers } from "./AdvanceControls";
import AttendanceCell from "./AttendanceCell";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import SalaryModifiers from "./SalaryModifiers";

export const DESKTOP_COLUMNS =
  "grid-cols-[minmax(0,1.3fr)_140px_minmax(0,1.2fr)_64px_92px_164px_80px]";

type Props = {
  row: SalaryEntry;
  isMe: boolean;
  advance: AdvanceHandlers;
};

export default function SalaryDesktopRow({ row, isMe, advance }: Props) {
  return (
    <div
      className={cn(
        "grid min-h-13.5 items-center gap-3 border-b border-border/60 px-4 py-1.5",
        DESKTOP_COLUMNS,
        isMe && "bg-green-50/70 dark:bg-green-500/5",
      )}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <PlayerAvatar row={row} />
        <PlayerName row={row} isMe={isMe} />
      </span>
      <AttendanceCell row={row} />
      <SalaryModifiers row={row} />
      <span className="text-right text-sm text-muted-foreground tabular-nums">
        {Math.round(row.weightPercent)}%
      </span>
      <GoldAmount value={row.total} className="justify-end" />
      <AdvanceControls row={row} handlers={advance} />
      <span className="text-right font-semibold tabular-nums">
        {formatNumber(remaining(row), 0)}
      </span>
    </div>
  );
}
