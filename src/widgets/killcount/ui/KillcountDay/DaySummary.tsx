import { StatTile, StatUnit } from "@/shared/ui";
import { formatNumber } from "@/shared/lib/format";

type Props = {
  totalKills: number;
  totalHonor: number;
  playerCount: number;
};

export default function DaySummary({
  totalKills,
  totalHonor,
  playerCount,
}: Props) {
  return (
    <section
      aria-label="Итоги дня"
      className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
    >
      <StatTile label="Всего килов">
        <span className="text-red-600 dark:text-red-400">
          {formatNumber(totalKills)}
        </span>
      </StatTile>
      <StatTile label="Хонора">{formatNumber(totalHonor)}</StatTile>
      <StatTile label="Игроков">{playerCount}</StatTile>
      <StatTile label="В среднем на игрока">
        {playerCount ? Math.round(totalKills / playerCount) : 0}
        <StatUnit>килов</StatUnit>
      </StatTile>
    </section>
  );
}
