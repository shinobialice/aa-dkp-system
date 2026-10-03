import type { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import { formatNumber } from "@/shared/lib/format";
import StatTile from "./StatTile";

export type Attendance = Awaited<ReturnType<typeof getUserMonthlyAttendance>>;

export default function AttendanceTiles({ data }: { data: Attendance }) {
  const percentTiles = [
    { label: "АГЛ", percent: data.aglPercent },
    { label: "Прайм", percent: data.primePercent },
    { label: "Итого", percent: data.totalPercent },
  ];
  const pointsPercent = data.totalPointsAvailable
    ? (data.dkp / data.totalPointsAvailable) * 100
    : 0;

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
      {percentTiles.map((tile) => (
        <StatTile
          key={tile.label}
          label={tile.label}
          value={`${Math.round(tile.percent)}%`}
          percent={tile.percent}
          colored
        />
      ))}
      <StatTile
        label="Баллы"
        value={`${formatNumber(data.dkp, 2)} / ${formatNumber(data.totalPointsAvailable, 2)}`}
        percent={pointsPercent}
        colored={false}
      />
    </div>
  );
}
