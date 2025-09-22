"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  getGuildAttendanceAgl,
  getGuildAttendancePrime,
} from "@/src/actions/guildStats";
import { RoundedTooltipContent } from "./RoundedTooltipContent";

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function DailyAttendanceChart({
  year,
  month,
  setYear,
  setMonth,
}: {
  year: number;
  month: number;
  setYear: (val: number) => void;
  setMonth: (val: number) => void;
}) {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getGuildAttendancePrime({ year, month }),
      getGuildAttendanceAgl({ year, month }),
    ]).then(([prime, agl]) => {
      const raidsByDay: Record<string, { prime: number; agl: number }> = {};

      for (const day of prime.daily ?? []) {
        const key = day.date.split("T")[0];
        raidsByDay[key] = { ...raidsByDay[key], prime: day.value };
      }
      for (const day of agl.daily ?? []) {
        const key = day.date.split("T")[0];
        raidsByDay[key] = { ...raidsByDay[key], agl: day.value };
      }

      const merged = Object.entries(raidsByDay)
        .map(([date, values]) => ({
          date,
          prime: values.prime ?? 0,
          agl: values.agl ?? 0,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

      setChartData(merged);
    });
  }, [year, month]);

  const chartConfig = {
    prime: {
      label: "Прайм",
      color: "hsl(var(--chart-1))",
    },
    agl: {
      label: "АГЛ",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Общая посещаемость по дням</CardTitle>
        <div className="flex gap-2">
          <Select
            value={String(year)}
            onValueChange={(val) => setYear(Number(val))}
          >
            <SelectTrigger className="w-[90px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(month)}
            onValueChange={(val) => setMonth(Number(val))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((label, index) => (
                <SelectItem key={index} value={String(index)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-[250px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillprime" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-prime)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-prime)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillagl" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-agl)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-agl)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${Math.round(v)}%`}
              />
              <Area
                type="monotone"
                dataKey="prime"
                stroke="var(--color-prime)"
                fill="url(#fillprime)"
              />
              <Area
                type="monotone"
                dataKey="agl"
                stroke="var(--color-agl)"
                fill="url(#fillagl)"
              />
              <ChartTooltip
                content={
                  <RoundedTooltipContent
                    labelFormatter={(val) => `Дата: ${val}`}
                  />
                }
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
