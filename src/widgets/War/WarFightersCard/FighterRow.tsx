import Image from "next/image";
import { cn } from "@/shared/lib/tw-merge";
import MeterBar from "../MeterBar";
import type { Fighter, FighterSort } from "../warModel";
import WarUserLink from "../WarUserLink";
import ClassTag from "./ClassTag";
import FighterAvatar from "./FighterAvatar";
import {
  FIGHTER_COLUMNS,
  formatMetric,
  METRIC_LABEL,
  placeTone,
  SORT_OPTIONS,
  type MetricMax,
} from "./fightersMeta";

type Props = {
  fighter: Fighter;
  place: number;
  sort: FighterSort;
  max: MetricMax;
  totalRaids: number;
  isMe: boolean;
};

export default function FighterRow({
  fighter,
  place,
  sort,
  max,
  totalRaids,
  isMe,
}: Props) {
  const value = fighter[sort];
  const otherMetrics = SORT_OPTIONS.filter((option) => option.value !== sort)
    .filter((option) => fighter[option.value] !== null)
    .map(
      (option) =>
        `${METRIC_LABEL[option.value]} ${formatMetric(option.value, fighter[option.value], totalRaids)}`,
    )
    .join(" · ");

  return (
    <li
      data-flip-key={isMe ? undefined : fighter.userId}
      className={cn(
        "grid min-h-14 items-center gap-2.5 border-b border-border/60 bg-card px-4 py-1.5 last:border-b-0 sm:px-5",
        FIGHTER_COLUMNS,
        isMe &&
          "sticky bottom-0 z-[1] bg-green-50 shadow-[inset_3px_0_0_var(--color-green-500)] dark:bg-green-950",
      )}
    >
      <span
        className={cn(
          "text-center font-display tabular-nums",
          placeTone(place),
        )}
      >
        {place}
      </span>
      <FighterAvatar fighter={fighter} />
      <div className="min-w-0">
        <WarUserLink
          userId={fighter.userId}
          name={fighter.name}
          className="block font-semibold"
        />
        <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <ClassTag userClass={fighter.userClass} />
          {otherMetrics && <span className="truncate">· {otherMetrics}</span>}
        </span>
      </div>
      <RankIcon fighter={fighter} />
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-display tabular-nums">
          {formatMetric(sort, value, totalRaids)}
        </span>
        {value !== null && (
          <MeterBar
            percent={(value / max[sort]) * 100}
            className="h-1.5 -skew-x-[20deg] rounded-none"
            barClassName="rounded-none bg-green-500"
          />
        )}
      </div>
    </li>
  );
}

function RankIcon({ fighter }: { fighter: Fighter }) {
  if (!fighter.rank) return <span />;
  return (
    <Image
      src={fighter.rank.icon}
      alt={fighter.rank.name}
      title={fighter.rank.name}
      width={26}
      height={26}
      className="size-6.5 object-contain"
    />
  );
}
