"use client";

import { useEffect, useState } from "react";
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
  AreaChart,
  Area,
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
}: {
  year: number;
  setYear: (val: number) => void;
}) {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      getGuildPrimeStatsByYear(year),
      getGuildAglStatsByYear(year),
    ]).then(([prime, agl]) => {
      const merged = prime.map((p, i) => ({
        month: p.month,
        prime: p.percent ?? 0,
        agl: agl[i]?.percent ?? 0,
      }));
      setData(merged);
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
            {[2023, 2024, 2025].map((y) => (
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
            <AreaChart data={data}>
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
              <XAxis dataKey="month" />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${Math.round(v)}%`}
              />
              <Area
                type="natural"
                dataKey="prime"
                fill="url(#fillprime)"
                stroke="var(--color-prime)"
              />
              <Area
                type="natural"
                dataKey="agl"
                fill="url(#fillagl)"
                stroke="var(--color-agl)"
              />
              <ChartTooltip
                content={
                  <RoundedTooltipContent
                    labelFormatter={(val: any) => `Месяц: ${val}`}
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
