"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserActivity } from "@/src/actions/getUserActivity";

const chartConfig = {
  праймы: {
    label: "праймы",
    color: "hsl(var(--chart-1))",
  },
  агл: {
    label: "агл",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

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

export function UserActivityChart({ userId }: { userId: number }) {
  const [chartData, setChartData] = React.useState<any[]>([]);
  const [types, setTypes] = React.useState<string[]>(["праймы", "агл"]);
  const [selectedYear, setSelectedYear] = React.useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = React.useState<number | null>(
    new Date().getMonth()
  );

  const dateRange = React.useMemo(() => {
    const from = new Date(selectedYear, selectedMonth ?? 0, 1);
    const to =
      selectedMonth !== null
        ? new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59)
        : new Date(selectedYear, 11, 31, 23, 59, 59);
    return { from, to };
  }, [selectedYear, selectedMonth]);

  React.useEffect(() => {
    getUserActivity(userId).then(setChartData);
  }, [userId]);

  const filteredData = chartData
    .filter((item) => {
      const date = new Date(item.date);
      return (
        date >= dateRange.from &&
        date <= dateRange.to &&
        types.some((type) => item[type] !== undefined)
      );
    })
    .map((item) => {
      const date = new Date(item.date);
      const month = months[date.getMonth()];
      const filteredEntry: Record<string, any> = {
        date: item.date,
        month,
      };
      types.forEach((type) => {
        if (item[type] !== undefined) {
          filteredEntry[type] = item[type];
        }
      });
      return filteredEntry;
    });

  return (
    <Card>
      <CardHeader className="flex flex-wrap items-center gap-4 border-b py-5">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Индивидуальная посещаемость</CardTitle>
          <CardDescription>
            По типам рейдов и выбранному периоду
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {/* Типы рейдов */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="cursor-pointer" variant="outline">
                {types.length === 2 ? "Все типы" : types.join(", ") || "Типы"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40">
              <DropdownMenuLabel>Типы рейдов</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {["праймы", "агл"].map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={types.includes(type)}
                  onCheckedChange={(checked) => {
                    setTypes((prev) =>
                      checked ? [...prev, type] : prev.filter((t) => t !== type)
                    );
                  }}
                >
                  {type}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Выбор года */}
          <Select
            value={String(selectedYear)}
            onValueChange={(val) => setSelectedYear(Number(val))}
          >
            <SelectTrigger className="w-[100px] cursor-pointer">
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

          {/* Выбор месяца */}
          <Select
            value={selectedMonth !== null ? String(selectedMonth) : "all"}
            onValueChange={(val) => {
              setSelectedMonth(val === "all" ? null : Number(val));
            }}
          >
            <SelectTrigger className="w-[140px] cursor-pointer">
              <SelectValue placeholder="Весь год" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Весь год</SelectItem>
              {months.map((label, index) => (
                <SelectItem key={index} value={String(index)}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
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
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={selectedMonth === null ? "month" : "date"}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                if (selectedMonth === null) {
                  return value; // Уже название месяца
                }
                const date = new Date(value);
                return date.toLocaleDateString("ru-RU", {
                  day: "numeric",
                });
              }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (selectedMonth === null) {
                      return value;
                    }
                    return new Date(value).toLocaleDateString("ru-RU", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            {types.includes("агл") && (
              <Area
                dataKey="агл"
                type="natural"
                fill="url(#fillагл)"
                stroke="var(--color-агл)"
                stackId="a"
              />
            )}
            {types.includes("праймы") && (
              <Area
                dataKey="праймы"
                type="natural"
                fill="url(#fillпраймы)"
                stroke="var(--color-праймы)"
                stackId="a"
              />
            )}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
