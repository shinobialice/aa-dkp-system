import { formatNumber } from "@/shared/lib/format";
import { honor, kills } from "../killcountModel";
import ClassBadge from "./ClassBadge";
import CommentBadge from "./CommentBadge";
import KillBar from "./KillBar";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import type { RowListProps } from "./rowListProps";

export default function KillCards({
  rows,
  maxKills,
  placeOf,
  renderEdit,
}: RowListProps) {
  return (
    <div className="flex flex-col @[44rem]/kills:hidden">
      {rows.map((row) => (
        <div
          key={row.id}
          className="grid grid-cols-[1.75rem_minmax(0,1fr)_auto] items-center gap-x-2.5 gap-y-1.5 border-b px-3 py-2.5 last:border-b-0"
        >
          <span className="text-center font-semibold text-muted-foreground">
            {placeOf(row)}
          </span>
          <span className="flex min-w-0 items-center gap-2">
            <PlayerAvatar row={row} />
            <span className="flex min-w-0 flex-col items-start gap-0.5">
              <span className="flex max-w-full min-w-0 items-center gap-1.5">
                <PlayerName row={row} />
                <CommentBadge comment={row.comment} />
              </span>
              <ClassBadge row={row} />
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-right leading-tight tabular-nums">
              <span className="block text-lg font-bold text-red-600 dark:text-red-400">
                {kills(row)}
              </span>
              <span className="text-2xs text-muted-foreground">
                {formatNumber(honor(row))} хон.
              </span>
            </span>
            {renderEdit(row)}
          </span>
          <span className="col-start-2 col-end-4">
            <KillBar value={kills(row)} max={maxKills} />
          </span>
        </div>
      ))}
    </div>
  );
}
