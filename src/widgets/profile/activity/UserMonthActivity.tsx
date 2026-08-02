"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";

const formatPoints = (n: number) => Number(n.toFixed(2)).toString();

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

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui/select";

import { useEffect } from "react";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";

type Props = {
  userId: number;
  initialMonth?: number; // 0-based
  initialYear?: number;
};

function StatCard({
  label,
  value,
  percent,
  emphasized,
}: {
  label: string;
  value: string;
  percent: number;
  emphasized?: boolean;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div
      className={`space-y-2 rounded-lg border p-4 ${
        emphasized ? "border-primary/40 bg-primary/5" : "bg-card"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="text-2xl font-bold tabular-nums">{value}</div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

export function UserMonthActivity({
  userId,
  initialMonth,
  initialYear,
}: Props) {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    initialMonth ?? now.getMonth(),
  );
  const [selectedYear, setSelectedYear] = useState(
    initialYear ?? now.getFullYear(),
  );
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    aglPercent: number;
    primePercent: number;
    totalPercent: number;
    dkp: number;
    totalPointsAvailable: number;
  } | null>(null);
  const yearOptions = [];
  for (let y = now.getFullYear() - 3; y <= now.getFullYear() + 1; y++) {
    yearOptions.push(y);
  }

  useEffect(() => {
    setLoading(true);
    getUserMonthlyAttendance(userId, selectedYear, selectedMonth + 1)
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId, selectedMonth, selectedYear]);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle className="text-lg">
            {months[selectedMonth]} {selectedYear}
          </CardTitle>
          <CardDescription>Посещаемость и учёт баллов за месяц</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(selectedMonth)}
            onValueChange={(v) => setSelectedMonth(Number(v))}
          >
            <SelectTrigger className="min-w-[110px]">
              <SelectValue>{months[selectedMonth]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {months.map((m, idx) => (
                <SelectItem value={String(idx)} key={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(selectedYear)}
            onValueChange={(v) => setSelectedYear(Number(v))}
          >
            <SelectTrigger className="min-w-[80px]">
              <SelectValue>{selectedYear}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((y) => (
                <SelectItem value={String(y)} key={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <div className="flex h-[168px] items-center justify-center text-muted-foreground">
            Загрузка...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              label="АГЛ"
              value={`${data.aglPercent.toFixed(2)}%`}
              percent={data.aglPercent}
            />
            <StatCard
              label="Прайм"
              value={`${data.primePercent.toFixed(2)}%`}
              percent={data.primePercent}
            />
            <StatCard
              label="Итого"
              value={`${data.totalPercent.toFixed(2)}%`}
              percent={data.totalPercent}
              emphasized
            />
            <StatCard
              label="Учёт баллов"
              value={`${formatPoints(data.dkp)} / ${formatPoints(data.totalPointsAvailable)}`}
              percent={
                data.totalPointsAvailable
                  ? (data.dkp / data.totalPointsAvailable) * 100
                  : 0
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
