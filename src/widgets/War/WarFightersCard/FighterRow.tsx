import { cn } from "@/shared/lib/tw-merge";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import MeterBar from "../MeterBar";
import PlaceNumber from "../PlaceNumber";
import type { Fighter, FighterSort } from "../warModel";
import WarUserLink from "../WarUserLink";
import ClassTag from "./ClassTag";
import FighterAvatar from "./FighterAvatar";
import {
  FIGHTER_COLUMNS,
  formatMetric,
  METRIC_LABEL,
  SORT_OPTIONS,
  type MetricMax,
} from "./fightersMeta";

type Props = {
  fighter: Fighter;
  place: number;
  sort: FighterSort;
  max: MetricMax;
  totalRaids: number;
};

export default function FighterRow({
  fighter,
  place,
  sort,
  max,
  totalRaids,
}: Props) {
  const format = (key: FighterSort) =>
    formatMetric(key, fighter[key], totalRaids);
  const otherMetrics = SORT_OPTIONS.filter((option) => option.value !== sort)
    .map((option) => `${METRIC_LABEL[option.value]} ${format(option.value)}`)
    .join(" · ");

  return (
    <li className="border-b border-border/60 px-4 py-1 last:border-b-0">
      <div
        className={cn(
          "hidden min-h-13 items-center gap-3 sm:grid",
          FIGHTER_COLUMNS,
        )}
      >
        <PlaceNumber place={place} />
        <div className="flex min-w-0 items-center gap-3">
          <FighterAvatar fighter={fighter} />
          <div className="min-w-0">
            <WarUserLink
              userId={fighter.userId}
              name={fighter.name}
              className="block font-semibold"
            />
            {(fighter.userClass || fighter.rank) && (
              <span className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
                <ClassTag userClass={fighter.userClass} />
                {fighter.userClass && fighter.rank && <span>·</span>}
                {fighter.rank && (
                  <span className="truncate">{fighter.rank.name}</span>
                )}
              </span>
            )}
          </div>
        </div>
        {SORT_OPTIONS.map(({ value: key }) => (
          <MetricCell
            key={key}
            value={fighter[key]}
            text={format(key)}
            active={key === sort}
            max={max[key]}
          />
        ))}
      </div>

      <div className="grid min-h-14 grid-cols-[22px_36px_minmax(0,1fr)_auto] items-center gap-2.5 sm:hidden">
        <PlaceNumber place={place} />
        <FighterAvatar fighter={fighter} />
        <div className="min-w-0">
          <span className="flex min-w-0 items-center gap-1.5">
            <WarUserLink
              userId={fighter.userId}
              name={fighter.name}
              className="min-w-0 font-semibold"
            />
            {fighter.userClass && (
              <span
                className="shrink-0 [&_svg]:size-3.5"
                style={{ color: classColors[fighter.userClass] }}
                title={fighter.userClass}
              >
                {classIcons[fighter.userClass]}
              </span>
            )}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {otherMetrics}
          </span>
        </div>
        <span
          className={cn(
            "text-base font-bold tabular-nums",
            fighter[sort] === null && "font-medium text-muted-foreground/60",
          )}
        >
          {format(sort)}
        </span>
      </div>
    </li>
  );
}

type MetricCellProps = {
  value: number | null;
  text: string;
  active: boolean;
  max: number;
};

function MetricCell({ value, text, active, max }: MetricCellProps) {
  return (
    <div className="flex flex-col items-end gap-1.5">
      <span className={cn("tabular-nums", metricTone(value, active))}>
        {text}
      </span>
      {active && value !== null && (
        <MeterBar percent={(value / max) * 100} barClassName="bg-red-500/80" />
      )}
    </div>
  );
}

function metricTone(value: number | null, active: boolean) {
  if (value === null) return "text-muted-foreground/60";
  return active ? "font-bold" : "font-medium text-foreground/80";
}
