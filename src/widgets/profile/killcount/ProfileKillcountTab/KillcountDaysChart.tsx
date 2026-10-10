"use client";

import { useRouter } from "next/navigation";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import type { UserKillcountDay } from "@/actions/getUserKillcountHistory";
import { formatNumber } from "@/shared/lib/format";
import { ChartContainer, ChartTooltip } from "@/shared/ui";
import { longDate, shortDate } from "@/widgets/killcount/ui/killcountModel";
import { chartPoints, type KillcountChartPoint } from "./profileKillcountModel";

type Props = {
  days: UserKillcountDay[];
};

const KILLS_COLOR = "var(--color-red-500)";
const GUILD_COLOR = "var(--muted-foreground)";

const chartConfig = {
  kills: { label: "Киллы", color: KILLS_COLOR },
  guildAvgKills: { label: "В среднем по гильдии", color: GUILD_COLOR },
};

export default function KillcountDaysChart({ days }: Props) {
  const router = useRouter();
  const points = chartPoints(days);
  const pointByDate = new Map(points.map((point) => [point.date, point]));

  const handleDayOpen = (index: number | undefined) => {
    if (index == null || index < 0) return;
    router.push(`/kill-counter/history/${points[index].date}`);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">Киллы по дням</span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-sm"
            style={{ backgroundColor: KILLS_COLOR }}
          />
          {chartConfig.kills.label}
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="h-0.5 w-3 rounded-full"
            style={{ backgroundColor: GUILD_COLOR }}
          />
          {chartConfig.guildAvgKills.label}
        </span>
        <span>· нажмите на день, чтобы открыть его</span>
      </div>
      <ChartContainer className="h-48 w-full" config={chartConfig}>
        <ComposedChart
          accessibilityLayer
          data={points}
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          className="cursor-pointer"
          onClick={(state) => handleDayOpen(state?.activeTooltipIndex)}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={shortDate}
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={8}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <ChartTooltip
            cursor={{ fill: "var(--color-muted)", opacity: 0.6 }}
            content={({ label }) => (
              <DayTooltip point={pointByDate.get(String(label))} />
            )}
          />
          <Bar dataKey="kills" fill={KILLS_COLOR} radius={3} />
          <Line
            dataKey="guildAvgKills"
            type="monotone"
            stroke={GUILD_COLOR}
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
            activeDot={false}
          />
        </ComposedChart>
      </ChartContainer>
    </div>
  );
}

function DayTooltip({ point }: { point: KillcountChartPoint | undefined }) {
  if (!point) return null;

  return (
    <div className="grid min-w-40 gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl">
      <span className="font-medium">{longDate(point.date)}</span>
      <TooltipKills point={point} />
      <span className="flex justify-between gap-4 text-muted-foreground">
        По гильдии в среднем
        <span className="font-mono text-foreground tabular-nums">
          {formatNumber(point.guildAvgKills)}
        </span>
      </span>
    </div>
  );
}

function TooltipKills({ point }: { point: KillcountChartPoint }) {
  if (point.kills === null) {
    return <span className="text-muted-foreground">Не было в киллкаунте</span>;
  }

  return (
    <span className="flex justify-between gap-4 text-muted-foreground">
      Киллы · {point.place}-е место из {point.players}
      <span className="font-mono font-medium text-foreground tabular-nums">
        {formatNumber(point.kills)}
      </span>
    </span>
  );
}
