import { formatNumber } from "@/shared/lib/format";
import { honor, kills } from "../killcountModel";
import ClassBadge from "./ClassBadge";
import CommentBadge from "./CommentBadge";
import KillBar from "./KillBar";
import PlayerAvatar from "./PlayerAvatar";
import PlayerName from "./PlayerName";
import Range from "./Range";
import type { RowListProps } from "./rowListProps";

export default function KillTable({
  rows,
  maxKills,
  placeOf,
  renderEdit,
  isCanEdit,
}: RowListProps) {
  return (
    <table className="hidden w-full border-collapse tabular-nums @[44rem]/kills:table">
      <thead className="sticky top-0 z-10 bg-muted text-2xs font-semibold tracking-wide text-muted-foreground uppercase shadow-[0_1px_0_var(--color-border)]">
        <tr>
          <th className="w-12 px-3 py-2 text-center">#</th>
          <th className="px-3 py-2 text-left">Игрок</th>
          <th className="px-3 py-2 text-left">Класс</th>
          <th className="px-3 py-2 text-left">Килы</th>
          <th className="px-3 py-2 text-right">Хонор</th>
          {isCanEdit && <th className="w-10" />}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.id}
            className="border-b last:border-b-0 hover:bg-muted/50"
          >
            <td className="px-3 py-2 text-center font-semibold text-muted-foreground">
              {placeOf(row)}
            </td>
            <td className="max-w-64 px-3 py-2">
              <span className="flex min-w-0 items-center gap-2">
                <PlayerAvatar row={row} />
                <PlayerName row={row} />
                <CommentBadge comment={row.comment} />
              </span>
            </td>
            <td className="px-3 py-2">
              <ClassBadge row={row} />
            </td>
            <td className="min-w-48 px-3 py-2">
              <span className="flex items-center gap-2.5">
                <span className="flex-1">
                  <KillBar value={kills(row)} max={maxKills} />
                </span>
                <span className="min-w-7 text-right text-base font-bold">
                  {kills(row)}
                </span>
              </span>
              <Range from={row.startKills} to={row.endKills} />
            </td>
            <td className="px-3 py-2 text-right whitespace-nowrap">
              <span className="font-bold">{formatNumber(honor(row))}</span>
              <Range from={row.startHonor} to={row.endHonor} />
            </td>
            {isCanEdit && <td className="px-1">{renderEdit(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
