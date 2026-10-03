"use client";

import { useState, type Ref } from "react";
import { cn } from "@/shared/lib/tw-merge";
import type {
  SalaryEntry,
  SalaryGroup,
  SalarySort,
  SalarySortKey,
} from "../financeModel";
import type { AdvanceHandlers } from "./AdvanceControls";
import GroupTitle from "./GroupTitle";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import SalaryDesktopRow, { DESKTOP_COLUMNS } from "./SalaryDesktopRow";
import SortableHeaders from "./SortableHeaders";
import UnpaidToggle from "./UnpaidToggle";

type Props = {
  ref: Ref<HTMLDivElement>;
  groups: SalaryGroup[];
  grouped: boolean;
  unpaid: SalaryEntry[];
  isEmpty: boolean;
  sort: SalarySort;
  currentUserId: number | null;
  unpaidReasons: Record<number, string>;
  advance: AdvanceHandlers;
  onSort: (key: SalarySortKey) => void;
};

export default function SalaryDesktopTable({
  ref,
  groups,
  grouped,
  unpaid,
  isEmpty,
  sort,
  currentUserId,
  unpaidReasons,
  advance,
  onSort,
}: Props) {
  const [showUnpaid, setShowUnpaid] = useState(false);

  return (
    <div
      ref={ref}
      className="hidden max-h-[min(75vh,760px)] overflow-y-auto rounded-xl border bg-card [scrollbar-width:thin] xl:block"
    >
      <div
        className={cn(
          "sticky top-0 z-10 grid items-center gap-3 border-b bg-muted px-4 py-2 text-xs font-medium text-muted-foreground",
          DESKTOP_COLUMNS,
        )}
      >
        <SortableHeaders sort={sort} onSort={onSort} />
      </div>

      {isEmpty && (
        <p className="px-4 py-10 text-center text-sm text-muted-foreground">
          Никого не нашлось
        </p>
      )}

      {groups.map((group) => (
        <div key={group.key}>
          {grouped && <GroupTitle group={group} desktop />}
          {group.rows.map((row) => (
            <SalaryDesktopRow
              key={row.id}
              row={row}
              isMe={row.userId === currentUserId}
              advance={advance}
            />
          ))}
        </div>
      ))}

      {unpaid.length > 0 && (
        <UnpaidToggle
          count={unpaid.length}
          open={showUnpaid}
          onToggle={() => setShowUnpaid(!showUnpaid)}
          className="border-b bg-muted/40 px-4 py-2.5"
        />
      )}
      {showUnpaid &&
        unpaid.map((row) => (
          <div
            key={row.id}
            className="grid min-h-12 grid-cols-[minmax(0,1.3fr)_140px_minmax(0,2fr)] items-center gap-3 border-b border-border/60 px-4 py-1.5 text-muted-foreground"
          >
            <span className="flex min-w-0 items-center gap-2.5 opacity-80">
              <PlayerAvatar row={row} />
              <PlayerName row={row} isMe={row.userId === currentUserId} />
            </span>
            <span className="text-sm tabular-nums">
              посещаемость {Math.round(row.totalPercent)}%
            </span>
            <span className="text-sm">
              {unpaidReasons[row.userId] ?? "Вес за месяц — 0"}
            </span>
          </div>
        ))}
    </div>
  );
}
