"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const baseSchedule: Record<string, [string, string][]> = {
  Понедельник: [
    ["19:30", "Кракен"],
    ["20:30", "Калидис"],
    ["21:30", "Анталлон"],
  ],
  Вторник: [
    ["19:30", "Ксанатос"],
    ["20:30", "Левиафан"],
    ["21:30", "Фесаникс"],
  ],
  Среда: [["21:00", "Осада замка"]],
  Четверг: [
    ["19:30", "Кракен"],
    ["20:30", "Левиафан"],
  ],
  Пятница: [
    ["19:30", "Ксанатос"],
    ["20:30", "Калидис"],
    ["21:30", "Анталлон"],
  ],
  Суббота: [
    ["19:30", "Кракен"],
    ["21:00", "Калидис"],
  ],
  Воскресенье: [
    ["18:30", "Фесаникс"],
    ["19:30", "Ксанатос"],
    ["20:30", "Левиафан"],
    ["21:30", "Анталлон"],
  ],
};

const aglTimes = ["07:20", "11:20", "15:20", "19:20", "23:20", "03:20"];
const catTimes = ["10:00", "22:00"];

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

// Объединяем базу + АГЛ + Кошка и сортируем по времени
function getFullSchedule(): Record<string, [string, string][]> {
  const full: Record<string, [string, string][]> = {};
  for (const [day, events] of Object.entries(baseSchedule)) {
    const extra: [string, string][] = [
      ...aglTimes.map((t): [string, string] => [t, "АГЛ"]),
      ...catTimes.map((t): [string, string] => [t, "Кошка"]),
    ];
    full[day] = [...events, ...extra].sort((a, b) => a[0].localeCompare(b[0]));
  }
  return full;
}

export default function WeeklyBossSchedule() {
  const schedule = getFullSchedule();
  const days = Object.keys(schedule);
  const maxRows = Math.max(...Object.values(schedule).map((e) => e.length));

  return (
    <div className="overflow-x-auto p-4">
      <Table className="table-fixed border border-[--color-border] text-sm">
        <TableHeader>
          <TableRow>
            {days.map((day) => (
              <TableHead
                key={day}
                className="text-center border border-[--color-border] bg-[--card] text-[--card-foreground]"
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
                const event = schedule[day][rowIdx];
                const [time, boss] = event || [];
                return (
                  <TableCell
                    key={day + rowIdx}
                    className="border border-[--color-border] text-center align-top"
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
