import type { ArenaFighter, ArenaWindow } from "@/server/killcountArena/types";
import { avatarSrc, formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type { SortKey } from "../../ui/killcountModel";
import PlayerName from "../../ui/KillcountDay/PlayerName";
import {
  lateStart,
  metricOf,
  otherMetricText,
  placeTone,
} from "./killcountArenaModel";

type Props = {
  fighter: ArenaFighter;
  place: number;
  sort: SortKey;
  max: number;
  window: ArenaWindow | null;
  action?: React.ReactNode;
};

export const FIGHTER_COLUMNS =
  "grid-cols-[26px_36px_minmax(0,1fr)_80px] sm:grid-cols-[30px_36px_minmax(0,1fr)_minmax(110px,0.5fr)]";

export default function FighterRow({
  fighter,
  place,
  sort,
  max,
  window,
  action,
}: Props) {
  const color = fighter.role ? classColors[fighter.role] : undefined;
  const late = lateStart(fighter, window);
  const value = metricOf(fighter, sort);

  return (
    <li
      className={cn(
        "grid min-h-14 items-center gap-2.5 border-b border-border/60 px-4 py-1.5 last:border-b-0 sm:px-5",
        FIGHTER_COLUMNS,
        action &&
          "grid-cols-[26px_36px_minmax(0,1fr)_80px_24px] sm:grid-cols-[30px_36px_minmax(0,1fr)_minmax(110px,0.5fr)_24px]",
      )}
    >
      <span
        className={cn(
          "text-center font-display tabular-nums",
          place <= 3 ? "text-lg" : "",
          placeTone(place),
        )}
      >
        {place}
      </span>
      <Avatar
        className="size-9"
        style={{
          boxShadow: `0 0 0 2px var(--card), 0 0 0 3.5px ${color ?? "var(--border)"}`,
        }}
      >
        <AvatarImage
          src={avatarSrc(fighter.userName, fighter.avatarUrl)}
          alt=""
        />
        <AvatarFallback className="text-2xs font-semibold">
          {fighter.userName.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="flex min-w-0 flex-col">
        <span className="flex min-w-0">
          <PlayerName row={fighter} />
        </span>
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          {color && (
            <span
              aria-hidden
              className="size-2 shrink-0 rotate-45"
              style={{ backgroundColor: color }}
            />
          )}
          <span className="truncate">
            {fighter.playerClass || fighter.role}
            {" · "}
            {otherMetricText(fighter, sort)}
          </span>
        </span>
        {late && (
          <span className="text-2xs text-muted-foreground">
            опоздал — начало с {late}
          </span>
        )}
      </span>
      <span className="flex flex-col items-end gap-1.5">
        <span className="font-display tabular-nums">{formatNumber(value)}</span>
        <span className="relative block h-1.5 w-full -skew-x-[20deg] overflow-hidden bg-muted">
          <span
            className="absolute inset-y-0 left-0 bg-green-500"
            style={{ width: `${(value / max) * 100}%` }}
          />
        </span>
      </span>
      {action}
    </li>
  );
}
