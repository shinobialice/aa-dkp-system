// app/stats/page.tsx
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
  getGuildAttendancePrime,
  getGuildAttendanceAgl,
  getGuildPrimeStatsByYear,
  getGuildAglStatsByYear,
} from "@/src/actions/guildStats";

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

export default function StatsPage() {
  const currentDate = new Date();
  const [year2, setYear2] = useState(currentDate.getFullYear());
  const [month2, setMonth2] = useState(currentDate.getMonth());
  const [year3, setYear3] = useState(currentDate.getFullYear());

  const [primeData, setPrimeData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getGuildAttendancePrime({ year: year2, month: month2 }),
      getGuildAttendanceAgl({ year: year2, month: month2 }),
    ]).then(([prime, agl]) => {
      const raidsByDay: Record<string, { праймы: number; агл: number }> = {};

      for (const day of prime.daily ?? []) {
        const date = new Date(day.date);
        const key = date.toISOString().split("T")[0];
        raidsByDay[key] = { ...raidsByDay[key], праймы: day.value };
      }
      for (const day of agl.daily ?? []) {
        const date = new Date(day.date);
        const key = date.toISOString().split("T")[0];
        raidsByDay[key] = { ...raidsByDay[key], агл: day.value };
      }

      const merged = Object.entries(raidsByDay)
        .map(([date, values]) => ({
          date,
          праймы: values.праймы ?? 0,
          агл: values.агл ?? 0,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );

      setChartData(merged);
    });
  }, [year2, month2]);

  useEffect(() => {
    Promise.all([
      getGuildPrimeStatsByYear(year3),
      getGuildAglStatsByYear(year3),
    ]).then(([prime, agl]) => {
      const merged = prime.map((p, i) => ({
        month: p.month,
        праймы: p.percent ?? 0,
        агл: agl[i]?.агл ?? 0,
      }));
      setPrimeData(merged);
    });
  }, [year3]);

  const chartConfig = {
    праймы: {
      label: "Прайм",
      color: "hsl(var(--chart-1))",
    },
    агл: {
      label: "АГЛ",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Общая посещаемость по дням</CardTitle>
          <div className="flex gap-2">
            <Select
              value={String(year2)}
              onValueChange={(val) => setYear2(Number(val))}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[2023, 2024, 2025].map((year) => (
                  <SelectItem key={year} value={String(year)}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(month2)}
              onValueChange={(val) => setMonth2(Number(val))}
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
                  <linearGradient id="fillпраймы" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-праймы)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-праймы)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillагл" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-агл)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-агл)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Area
                  type="monotone"
                  dataKey="праймы"
                  stroke="var(--color-праймы)"
                  fill="url(#fillпраймы)"
                />
                <Area
                  type="monotone"
                  dataKey="агл"
                  stroke="var(--color-агл)"
                  fill="url(#fillагл)"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => `Дата: ${val}`}
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Посещаемость по месяцам</CardTitle>
          <Select
            value={String(year3)}
            onValueChange={(val) => setYear3(Number(val))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[2023, 2024, 2025].map((year) => (
                <SelectItem key={year} value={String(year)}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="pt-4">
          <ChartContainer className="w-full h-[300px]" config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={primeData}>
                <defs>
                  <linearGradient id="fillпраймы" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-праймы)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-праймы)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                  <linearGradient id="fillагл" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-агл)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-агл)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                <Area
                  type="natural"
                  dataKey="праймы"
                  fill="url(#fillпраймы)"
                  stroke="var(--color-праймы)"
                />
                <Area
                  type="natural"
                  dataKey="агл"
                  fill="url(#fillагл)"
                  stroke="var(--color-агл)"
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(val) => `Месяц: ${val}`}
                    />
                  }
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
