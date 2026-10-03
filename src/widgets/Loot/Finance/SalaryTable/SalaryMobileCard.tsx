import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { GoldAmount } from "@/shared/ui";
import { remaining, type SalaryEntry } from "../financeModel";
import AdvanceControls, { type AdvanceHandlers } from "./AdvanceControls";
import AttendanceCell from "./AttendanceCell";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import SalaryModifiers from "./SalaryModifiers";

type Props = {
  row: SalaryEntry;
  isMe: boolean;
  advance: AdvanceHandlers;
};

export default function SalaryMobileCard({ row, isMe, advance }: Props) {
  const showAdvance = advance.isAdmin || row.sentAmount > 0 || row.sent;

  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border bg-card px-3.5 py-3",
        isMe &&
          "border-green-200 bg-green-50/70 dark:border-green-500/25 dark:bg-green-500/5",
      )}
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
        <PlayerAvatar row={row} />
        <PlayerName row={row} isMe={isMe} />
        <GoldAmount value={row.total} className="justify-end text-base" />
      </div>
      <AttendanceCell row={row} />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SalaryModifiers row={row} />
        <span className="text-xs text-muted-foreground tabular-nums">
          вес {Math.round(row.weightPercent)}%
        </span>
      </div>
      {showAdvance && (
        <div className="flex items-center justify-between gap-2 border-t border-border/60 pt-2 text-xs text-muted-foreground">
          <AdvanceControls row={row} handlers={advance} />
          <span className="tabular-nums">
            остаток{" "}
            <b className="text-foreground">{formatNumber(remaining(row), 0)}</b>
          </span>
        </div>
      )}
    </div>
  );
}
