"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/shared/ui";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  getGuildAttendanceAgl,
  getGuildAttendancePrime,
} from "@/actions/guildStats";
import { RoundedTooltipContent } from "./RoundedTooltipContent";
import { getYearOptions } from "@/utils/getYearOptions";
import { mergeDailyAttendance } from "@/utils/mergeAttendanceSeries";

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
  initialData,
}: {
  year: number;
  month: number;
  setYear: (val: number) => void;
  setMonth: (val: number) => void;
  initialData?: ReturnType<typeof mergeDailyAttendance>;
}) {
  const [chartData, setChartData] = useState<any[]>(initialData ?? []);
  const skipNextFetch = useRef(!!initialData);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    Promise.all([
      getGuildAttendancePrime({ year, month }),
      getGuildAttendanceAgl({ year, month }),
    ]).then(([prime, agl]) => {
      setChartData(mergeDailyAttendance(prime, agl));
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
              {getYearOptions().map((y) => (
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
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => v.split("-")[2]}
              />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${Math.round(v)}%`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <RoundedTooltipContent
                    indicator="dashed"
                    labelFormatter={(val: any) => `Дата: ${val}`}
                  />
                }
              />
              <Bar dataKey="prime" fill="var(--color-prime)" radius={4} />
              <Bar dataKey="agl" fill="var(--color-agl)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
