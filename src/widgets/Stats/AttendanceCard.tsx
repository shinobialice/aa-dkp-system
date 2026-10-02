"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import {
  AGL_COLOR,
  dayLabel,
  MONTH_NAMES,
  PRIME_COLOR,
  type MonthlyAttendance,
} from "./statsModel";

export type AttendanceView = "day" | "month";

const chartConfig = {
  prime: { label: "Прайм", color: PRIME_COLOR },
  agl: { label: "АГЛ", color: AGL_COLOR },
};

export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex max-w-full gap-0.5 overflow-x-auto rounded-lg bg-muted p-[3px] [scrollbar-width:none]"
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "cursor-pointer rounded-md px-3 py-1 text-[12.5px] font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
            value === option.value && "bg-background text-foreground shadow-sm",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function percentTooltip(value: unknown, name: unknown) {
  const config = chartConfig[name as keyof typeof chartConfig];
  return (
    <div className="flex flex-1 items-center justify-between gap-4 leading-none">
      <span className="flex items-center gap-1.5 text-muted-foreground">
        <span
          className="size-2.5 rounded-[2px]"
          style={{ backgroundColor: config?.color }}
        />
        {config?.label}
      </span>
      <span className="font-mono font-medium text-foreground tabular-nums">
        {Math.round(Number(value))}%
      </span>
    </div>
  );
}

export default function AttendanceCard({
  view,
  onViewChange,
  days,
  monthly,
  year,
  selectedDate,
  onSelectDate,
  onSelectMonth,
}: {
  view: AttendanceView;
  onViewChange: (view: AttendanceView) => void;
  days: { date: string; day: number; prime: number; agl: number }[];
  monthly: MonthlyAttendance;
  year: number;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
  onSelectMonth: (month: number) => void;
}) {
  const byDay = view === "day";
  const data = byDay
    ? days.map((d) => ({ ...d, label: String(d.day) }))
    : monthly.map((m, i) => ({ ...m, label: MONTH_NAMES[i].slice(0, 3) }));
  const selectedLabel =
    byDay && selectedDate ? String(Number(selectedDate.split("-")[2])) : null;

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[15px] font-semibold">
          Посещаемость{!byDay && ` за ${year}`}
        </h2>
        <Segmented
          label="Разбивка"
          value={view}
          onChange={onViewChange}
          options={[
            { value: "day", label: "По дням" },
            { value: "month", label: "По месяцам" },
          ]}
        />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {(["prime", "agl"] as const).map((key) => (
          <span key={key} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-[3px]"
              style={{ backgroundColor: chartConfig[key].color }}
            />
            {chartConfig[key].label}
          </span>
        ))}
        <span>
          {byDay
            ? "· нажмите на день, чтобы увидеть его рейды"
            : "· нажмите на месяц, чтобы открыть его по дням"}
        </span>
      </div>
      <ChartContainer className="h-[230px] w-full" config={chartConfig}>
        <BarChart
          accessibilityLayer
          data={data}
          margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          barGap={1}
          className="cursor-pointer"
          onClick={(state) => {
            const index = state?.activeTooltipIndex;
            if (index == null || index < 0) return;
            if (byDay) onSelectDate(days[index].date);
            else onSelectMonth(index);
          }}
        >
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          {selectedLabel && (
            <ReferenceArea
              x1={selectedLabel}
              x2={selectedLabel}
              fill="var(--color-muted-foreground)"
              fillOpacity={0.15}
              ifOverflow="extendDomain"
            />
          )}
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
            tickFormatter={(v) => `${v}%`}
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
                  return byDay ? dayLabel(row.date) : row.month;
                }}
                formatter={percentTooltip}
              />
            }
          />
          <Bar dataKey="prime" fill={PRIME_COLOR} radius={3} />
          <Bar dataKey="agl" fill={AGL_COLOR} radius={3} />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
