"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { cn } from "@/shared/lib/tw-merge";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import {
  getUserMonthlyRaids,
  type UserMonthlyRaid,
} from "@/actions/getUserMonthlyRaids";

const MONTHS = [
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

const MONTHS_GENITIVE = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

type Attendance = Awaited<ReturnType<typeof getUserMonthlyAttendance>>;
type SortKey = "startDate" | "dkp";

function formatPoints(value: number): string {
  return Number(value.toFixed(2)).toLocaleString("ru-RU");
}

function tone(percent: number) {
  if (percent >= 80)
    return { text: "text-green-700 dark:text-green-400", bar: "bg-green-600" };
  if (percent >= 50)
    return { text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-red-700 dark:text-red-400", bar: "bg-red-500" };
}

function StatTile({
  label,
  value,
  percent,
  colored,
}: {
  label: string;
  value: string;
  percent: number;
  colored: boolean;
}) {
  const colors = colored
    ? tone(percent)
    : { text: "", bar: "bg-muted-foreground/50" };
  return (
    <div className="flex flex-col gap-1.5 rounded-lg bg-muted/50 px-3.5 py-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "text-xl font-bold tabular-nums sm:text-[22px]",
          colors.text,
        )}
      >
        {value}
      </span>
      <span className="relative block h-1.5 overflow-hidden rounded-full bg-border/70">
        <span
          className={cn("absolute inset-y-0 left-0 rounded-full", colors.bar)}
          style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
        />
      </span>
    </div>
  );
}

function raidPoints(raid: UserMonthlyRaid): number {
  return raid.isLate ? raid.dkpSummary / 2 : raid.dkpSummary;
}

export default function ProfileAttendanceTab({ userId }: { userId: number }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({
    key: "startDate",
    desc: true,
  });
  const [result, setResult] = useState<{
    key: string;
    attendance: Attendance;
    raids: UserMonthlyRaid[];
  } | null>(null);

  const requestKey = `${userId}-${year}-${month}`;
  const loading = result?.key !== requestKey;
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => now.getFullYear() - 3 + i,
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getUserMonthlyAttendance(userId, year, month + 1),
      getUserMonthlyRaids(userId, year, month + 1),
    ]).then(([attendance, raids]) => {
      if (!cancelled)
        setResult({ key: `${userId}-${year}-${month}`, attendance, raids });
    });
    return () => {
      cancelled = true;
    };
  }, [userId, year, month]);

  const raids = useMemo(() => {
    const list = [...(result?.raids ?? [])];
    list.sort((a, b) =>
      sort.key === "dkp"
        ? raidPoints(a) - raidPoints(b)
        : new Date(a.startDate ?? 0).getTime() -
          new Date(b.startDate ?? 0).getTime(),
    );
    return sort.desc ? list.reverse() : list;
  }, [result, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      desc: current.key === key ? !current.desc : true,
    }));

  const SortArrow = sort.desc ? ArrowDown : ArrowUp;
  const data = result?.attendance;

  return (
    <section
      aria-label="Посещаемость"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold">
            Посещаемость за {MONTHS_GENITIVE[month]} {year}
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Проценты и рейды за выбранный месяц
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={String(month)}
            onValueChange={(v) => setMonth(Number(v))}
          >
            <SelectTrigger
              className="min-w-[120px] cursor-pointer"
              aria-label="Месяц"
            >
              <SelectValue>{MONTHS[month]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((name, idx) => (
                <SelectItem value={String(idx)} key={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(year)}
            onValueChange={(v) => setYear(Number(v))}
          >
            <SelectTrigger
              className="min-w-[88px] cursor-pointer"
              aria-label="Год"
            >
              <SelectValue>{year}</SelectValue>
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
      </div>

      {loading || !data ? (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Загрузка…
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-2.5">
            <StatTile
              label="АГЛ"
              value={`${Math.round(data.aglPercent)}%`}
              percent={data.aglPercent}
              colored
            />
            <StatTile
              label="Прайм"
              value={`${Math.round(data.primePercent)}%`}
              percent={data.primePercent}
              colored
            />
            <StatTile
              label="Итого"
              value={`${Math.round(data.totalPercent)}%`}
              percent={data.totalPercent}
              colored
            />
            <StatTile
              label="Баллы"
              value={`${formatPoints(data.dkp)} / ${formatPoints(data.totalPointsAvailable)}`}
              percent={
                data.totalPointsAvailable
                  ? (data.dkp / data.totalPointsAvailable) * 100
                  : 0
              }
              colored={false}
            />
          </div>

          {raids.length === 0 ? (
            <p className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
              Нет посещённых рейдов за {MONTHS_GENITIVE[month]} {year}
            </p>
          ) : (
            <div className="max-h-[420px] overflow-y-auto rounded-lg border [scrollbar-width:thin]">
              <div className="sticky top-0 z-10 hidden grid-cols-[150px_100px_minmax(0,1fr)_96px_72px] items-center gap-3 bg-muted px-3.5 py-2 text-xs font-medium text-muted-foreground sm:grid">
                <button
                  type="button"
                  onClick={() => toggleSort("startDate")}
                  className={cn(
                    "inline-flex cursor-pointer items-center gap-1 text-left",
                    sort.key === "startDate" && "text-foreground",
                  )}
                >
                  Дата
                  {sort.key === "startDate" && (
                    <SortArrow className="size-3.5" />
                  )}
                </button>
                <span>Тип</span>
                <span>Боссы</span>
                <span>Опоздал</span>
                <button
                  type="button"
                  onClick={() => toggleSort("dkp")}
                  className={cn(
                    "inline-flex cursor-pointer items-center justify-end gap-1",
                    sort.key === "dkp" && "text-foreground",
                  )}
                >
                  Баллы
                  {sort.key === "dkp" && <SortArrow className="size-3.5" />}
                </button>
              </div>
              <ul>
                {raids.map((raid) => (
                  <li
                    key={raid.id}
                    className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 border-t border-border/60 px-3.5 py-2.5 first:border-t-0 sm:min-h-11 sm:grid-cols-[150px_100px_minmax(0,1fr)_96px_72px] sm:py-1.5"
                  >
                    <span className="text-sm tabular-nums max-sm:order-2 max-sm:col-start-1 max-sm:text-xs max-sm:text-muted-foreground">
                      {raid.startDate
                        ? new Date(raid.startDate).toLocaleString("ru-RU", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                      <span className="sm:hidden">
                        {raid.type ? ` · ${raid.type}` : ""}
                        {raid.isLate ? " · опоздал" : ""}
                      </span>
                    </span>
                    <span className="hidden sm:block">
                      {raid.type ? (
                        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">
                          {raid.type}
                        </span>
                      ) : (
                        "—"
                      )}
                    </span>
                    <span className="truncate font-medium max-sm:order-1">
                      {raid.bosses.length > 0 ? raid.bosses.join(", ") : "—"}
                    </span>
                    <span
                      className={cn(
                        "hidden text-sm sm:block",
                        raid.isLate
                          ? "font-medium text-red-700 dark:text-red-400"
                          : "text-muted-foreground",
                      )}
                    >
                      {raid.isLate ? "да" : "нет"}
                    </span>
                    <span className="text-right font-bold tabular-nums max-sm:order-1 max-sm:row-span-2">
                      {formatPoints(raidPoints(raid))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}
