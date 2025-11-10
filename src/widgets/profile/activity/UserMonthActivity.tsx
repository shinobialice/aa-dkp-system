"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

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
      <CardHeader>
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
        <CardTitle className="text-lg mt-2">
          {months[selectedMonth]} {selectedYear}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading || !data ? (
          <div className="flex items-center justify-center h-[325px] text-muted-foreground">
            Загрузка...
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 h-[325px]">
            <Card className="flex flex-col items-center justify-center p-4">
              <div className="text-sm text-muted-foreground">АГЛ</div>
              <div className="text-2xl font-bold">
                {data.aglPercent.toFixed(0)}%
              </div>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <div className="text-sm text-muted-foreground">Прайм</div>
              <div className="text-2xl font-bold">
                {data.primePercent.toFixed(0)}%
              </div>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <div className="text-sm text-muted-foreground">Итого</div>
              <div className="text-2xl font-bold">
                {data.totalPercent.toFixed(0)}%
              </div>
            </Card>
            <Card className="flex flex-col items-center justify-center p-4">
              <div className="text-sm text-muted-foreground">Учет баллов</div>
              <div className="text-2xl font-bold">{data.dkp}</div>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
