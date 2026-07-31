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
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { getBossIncomeByMonth, type BossIncomeStat } from "@/actions/guildStats";
import { getYearOptions } from "@/utils/getYearOptions";

const chartConfig = {
  income: {
    label: "Доход",
    color: "hsl(var(--chart-1))",
  },
};

export default function BossIncomeChart({
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
  initialData?: BossIncomeStat[];
}) {
  const [data, setData] = useState<BossIncomeStat[]>(initialData ?? []);
  const skipNextFetch = useRef(!!initialData);

  useEffect(() => {
    if (skipNextFetch.current) {
      skipNextFetch.current = false;
      return;
    }

    getBossIncomeByMonth(month, year).then(setData);
  }, [year, month]);

  const total = data.reduce((sum, d) => sum + d.income, 0);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Доход от боссов за месяц</CardTitle>
        <div className="flex gap-2">
          <Select
            value={String(month)}
            onValueChange={(val) => setMonth(Number(val))}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                <SelectItem key={m} value={String(m)}>
                  {new Date(0, m - 1).toLocaleString("ru-RU", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">
            Нет проданного лута за этот месяц
          </p>
        ) : (
          <>
            <ChartContainer className="w-full h-[300px]" config={chartConfig}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart accessibilityLayer data={data}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="boss"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                  />
                  <YAxis tickFormatter={(v) => v.toLocaleString("ru-RU")} />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        indicator="dashed"
                        labelFormatter={(val: any) => `Босс: ${val}`}
                        formatter={(value: any, _name, item: any) => (
                          <div className="flex flex-1 justify-between gap-4 leading-none">
                            <span className="text-muted-foreground">
                              Доход
                            </span>
                            <span className="text-foreground font-mono font-medium tabular-nums">
                              {Number(value).toLocaleString("ru-RU")}
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="income" radius={4}>
                    {data.map((entry, index) => (
                      <Cell
                        key={entry.boss}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
            <p className="text-muted-foreground text-sm mt-2 text-right">
              Итого: {total.toLocaleString("ru-RU")}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
