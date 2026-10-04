"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";
import type { GuildPeriod } from "@/actions/getGuildPeriods";
import type { UserMonthAttendance } from "@/actions/getUserYearlyAttendance";
import { MONTH_NAMES } from "@/shared/config/months";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui";
import { AGL_COLOR, PRIME_COLOR } from "@/widgets/Stats/statsModel";
import { monthPeriodsLabel, periodSegments } from "./attendanceChartModel";
import PeriodStrip from "./PeriodStrip";

type Props = {
  months: UserMonthAttendance[];
  periods: GuildPeriod[];
  year: number;
  selectedMonth: number;
  onMonthSelect: (month: number) => void;
};

const chartConfig = {
  prime: { label: "Прайм", color: PRIME_COLOR },
  agl: { label: "АГЛ", color: AGL_COLOR },
};

export default function AttendanceChart({
  months,
  periods,
  year,
  selectedMonth,
  onMonthSelect,
}: Props) {
  const chartData = months.map((month) => ({
    ...month,
    label: MONTH_NAMES[month.month].slice(0, 3),
    periods: monthPeriodsLabel(periods, year, month.month),
  }));
  const selectedLabel = chartData[selectedMonth].label;

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/50 px-3.5 py-3">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">
          По месяцам за {year}
        </span>
        {(["prime", "agl"] as const).map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: chartConfig[key].color }}
            />
            {chartConfig[key].label}
          </span>
        ))}
        <span>· нажмите на месяц, чтобы открыть его</span>
      </div>
      <ChartContainer className="h-48 w-full" config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          barGap={1}
          className="cursor-pointer"
          onClick={(state) => {
            const index = state?.activeTooltipIndex;
            if (index == null || index < 0) return;
            onMonthSelect(index);
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <ReferenceArea
            x1={selectedLabel}
            x2={selectedLabel}
            fill="var(--color-muted-foreground)"
            fillOpacity={0.15}
            ifOverflow="extendDomain"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            interval="preserveStartEnd"
            minTickGap={4}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tickFormatter={(value) => `${value}%`}
            tickLine={false}
            axisLine={false}
            width={44}
          />
          <ChartTooltip
            cursor={{ fill: "var(--color-muted)", opacity: 0.6 }}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  const row = payload?.[0]?.payload;
                  if (!row) return "";
                  const month = MONTH_NAMES[row.month];
                  return row.periods ? `${month} · ${row.periods}` : month;
                }}
                formatter={percentTooltip}
              />
            }
          />
          <Bar dataKey="prime" fill={PRIME_COLOR} radius={3} />
          <Bar dataKey="agl" fill={AGL_COLOR} radius={3} />
        </BarChart>
      </ChartContainer>
      <PeriodStrip segments={periodSegments(periods, year)} />
    </div>
  );
}

function percentTooltip(value: unknown, name: unknown) {
  const config = name === "prime" ? chartConfig.prime : chartConfig.agl;
  const percent =
    value == null ? "нет рейдов" : `${Math.round(Number(value))}%`;
  return (
    <div className="flex flex-1 items-center justify-between gap-4 leading-none">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span
          className="size-2.5 rounded-xs"
          style={{ backgroundColor: config.color }}
        />
        {config.label}
      </span>
      <span className="font-mono font-medium text-foreground tabular-nums">
        {percent}
      </span>
    </div>
  );
}
