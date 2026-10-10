import type { UserKillcountPlace } from "@/actions/getUserKillcountHistory";
import { formatNumber } from "@/shared/lib/format";
import { StatTile, StatUnit } from "@/shared/ui";
import { shortDate } from "@/widgets/killcount/ui/killcountModel";
import { killcountSummary, type PlayedDay } from "./profileKillcountModel";

type Props = {
  played: PlayedDay[];
  place: UserKillcountPlace | undefined;
};

const TILE_CLASS = "border-0 bg-muted/50";

export default function KillcountTiles({ played, place }: Props) {
  const summary = killcountSummary(played);

  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-4">
      <StatTile
        className={TILE_CLASS}
        label="Киллы"
        hint={place && `${place.place}-е место из ${place.players} в гильдии`}
      >
        <span className="text-red-600 dark:text-red-400">
          {formatNumber(summary.kills)}
        </span>
      </StatTile>
      <StatTile
        className={TILE_CLASS}
        label="Хонор"
        hint={`в среднем ${formatNumber(summary.avgHonor)} за день`}
      >
        {formatNumber(summary.honor)}
      </StatTile>
      <StatTile
        className={TILE_CLASS}
        label="Киллов за день"
        hint={`в среднем по гильдии ${formatNumber(summary.guildAvgKills)}`}
      >
        {formatNumber(summary.avgKills)}
      </StatTile>
      <BestDayTile best={summary.best} />
    </div>
  );
}

function BestDayTile({ best }: { best: PlayedDay | null }) {
  if (!best) {
    return (
      <StatTile className={TILE_CLASS} label="Лучший день">
        —
      </StatTile>
    );
  }

  return (
    <StatTile
      className={TILE_CLASS}
      label="Лучший день"
      hint={`${best.mine.place}-е место из ${best.players} за день`}
    >
      {formatNumber(best.mine.kills)}
      <StatUnit>{shortDate(best.date)}</StatUnit>
    </StatTile>
  );
}
