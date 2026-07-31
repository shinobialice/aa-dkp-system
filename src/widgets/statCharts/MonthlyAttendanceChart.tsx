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
  getGuildPrimeStatsByYear,
  getGuildAglStatsByYear,
} from "@/actions/guildStats";
import { RoundedTooltipContent } from "./RoundedTooltipContent";
import { getYearOptions } from "@/utils/getYearOptions";
import { mergeMonthlyAttendance } from "@/utils/mergeAttendanceSeries";

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

export default function MonthlyAttendanceChart({
  year,
  setYear,
  initialData,
}: {
  year: number;
  setYear: (val: number) => void;
  initialData?: ReturnType<typeof mergeMonthlyAttendance>;
}) {
  const [data, setData] = useState<any[]>(initialData ?? []);
  const skipNextFetch = useRef(!!initialData);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    Promise.all([
      getGuildPrimeStatsByYear(year),
      getGuildAglStatsByYear(year),
    ]).then(([prime, agl]) => {
      setData(mergeMonthlyAttendance(prime, agl));
    });
  }, [year]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Посещаемость по месяцам</CardTitle>
        <Select
          value={String(year)}
          onValueChange={(val) => setYear(Number(val))}
        >
          <SelectTrigger className="w-[100px]">
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
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer className="w-full h-[300px]" config={chartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(v) => v.slice(0, 3)}
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
                    labelFormatter={(val: any) => `Месяц: ${val}`}
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
