import { formatMoscowHM } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { formatMoscowShort } from "../mainPageTime";
import { hpCells, type RespawnInfo } from "./respawnModel";

type Props = {
  info: Extract<RespawnInfo, { progress: number }>;
  respawnHours: number;
  now: Date;
  fillClassName: string;
};

export default function RespawnHpBar({
  info,
  respawnHours,
  now,
  fillClassName,
}: Props) {
  return (
    <div className="mt-1.5 flex flex-col gap-1">
      <div aria-hidden className="flex h-2.5 gap-[3px]">
        {hpCells(info, respawnHours, now).map((cell, index) => (
          <span
            key={index}
            className={cn(
              "relative -skew-x-[20deg] overflow-hidden",
              cell.isWindow
                ? "flex-[1.3] bg-green-500/15 outline-[1.5px] -outline-offset-[1.5px] outline-green-500 outline-solid"
                : "flex-1 bg-muted",
            )}
          >
            <span
              className={cn(
                "absolute inset-y-0 left-0 transition-[width] duration-1000 ease-linear",
                cell.isWindow ? "bg-green-500" : fillClassName,
              )}
              style={{ width: `${cell.fill * 100}%` }}
            />
          </span>
        ))}
      </div>
      <p className="flex flex-wrap justify-between gap-x-2 text-xs text-muted-foreground tabular-nums">
        <span>убит {formatMoscowShort(info.killDate, now)}</span>
        <span>
          окно {formatMoscowShort(info.respawnStart, now)}–
          {formatMoscowHM(info.respawnEnd)}
        </span>
      </p>
    </div>
  );
}
