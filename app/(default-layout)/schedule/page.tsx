"use client";

import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getWeeklySchedule } from "@/src/actions/getWeeklySchedule";

const bossColors: Record<string, string> = {
  Кракен: "var(--chart-1)",
  Ксанатос: "var(--chart-5)",
  Левиафан: "var(--chart-2)",
  Калидис: "var(--chart-3)",
  Анталлон: "var(--chart-4)",
  Фесаникс: "var(--chart-2)",
  "Оборона Ифнира": "var(--chart-5)",
  "Великий луг": "var(--chart-1)",
  "Осада замка": "var(--foreground)",
  АГЛ: "var(--muted-foreground)",
  Кошка: "var(--accent-foreground)",
};

const weekdayNames = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];
const todayName = weekdayNames[new Date().getDay()];

export default function WeeklyBossSchedule() {
  const [schedule, setSchedule] = useState<Record<string, [string, string][]>>(
    {},
  );

  useEffect(() => {
    getWeeklySchedule().then(setSchedule);
  }, []);

  const days = Object.keys(schedule);
  const maxRows = Math.max(
    ...Object.values(schedule).map((e) => e.length || 0),
  );

  return (
    <div className="overflow-x-auto p-4">
      <Table className="table-fixed border border-[--color-border] text-sm">
        <TableHeader>
          <TableRow>
            {days.map((day) => (
              <TableHead
                key={day}
                className={`text-center border border-[--color-border] bg-[--card] text-[--card-foreground] ${
                  day === todayName ? "bg-green-100 dark:bg-green-900/40" : ""
                }`}
              >
                {day}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: maxRows }).map((_, rowIdx) => (
            <TableRow key={rowIdx}>
              {days.map((day) => {
                const event = schedule[day]?.[rowIdx];
                const [time, boss] = event || [];
                return (
                  <TableCell
                    key={day + rowIdx}
                    className={`border border-[--color-border] text-center align-top ${
                      day === todayName
                        ? "bg-green-50 dark:bg-green-900/10"
                        : ""
                    }`}
                  >
                    {event && (
                      <>
                        <div className="text-xs">{time}</div>
                        <div
                          className="font-semibold"
                          style={{ color: bossColors[boss] ?? "inherit" }}
                        >
                          {boss}
                        </div>
                      </>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
