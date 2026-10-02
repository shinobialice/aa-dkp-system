"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  getBossIncomeByMonth,
  getGuildAglStatsByYear,
  getGuildAttendanceAgl,
  getGuildAttendancePrime,
  getGuildPrimeStatsByYear,
  getRaidsByDay,
  type BossIncomeStat,
  type ClassArchetypeStat,
  type DailyRaidStat,
  type InventoryStockStat,
  type RosterClassStat,
  type SealGradeStat,
} from "@/actions/guildStats";
import {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";
import AttendanceCard, { type AttendanceView } from "./AttendanceCard";
import BossIncomeCard from "./BossIncomeCard";
import CompositionCard from "./CompositionCard";
import DayRaidsCard from "./DayRaidsCard";
import StatsKpis from "./StatsKpis";
import {
  fillMonth,
  FIRST_YEAR,
  isRaidDay,
  periodLabel,
  samePeriod,
  shiftPeriod,
  type DailyAttendance,
  type MonthlyAttendance,
  type Period,
} from "./statsModel";

export type MonthStats = {
  daily: DailyAttendance;
  previousDaily: DailyAttendance;
  income: BossIncomeStat[];
  previousIncome: BossIncomeStat[];
};

async function loadDaily({ year, month }: Period) {
  const [prime, agl] = await Promise.all([
    getGuildAttendancePrime({ year, month }),
    getGuildAttendanceAgl({ year, month }),
  ]);
  return mergeDailyAttendance(prime, agl);
}

async function loadMonth(period: Period): Promise<MonthStats> {
  const previous = shiftPeriod(period, -1);
  const [daily, previousDaily, income, previousIncome] = await Promise.all([
    loadDaily(period),
    loadDaily(previous),
    getBossIncomeByMonth(period.month + 1, period.year),
    getBossIncomeByMonth(previous.month + 1, previous.year),
  ]);
  return { daily, previousDaily, income, previousIncome };
}

/** Сегодня, если он в этом месяце, иначе последний день с рейдом. */
function defaultDate(period: Period, today: string, daily: DailyAttendance) {
  const days = fillMonth(period, daily);
  if (days.some((d) => d.date === today)) return today;
  return [...days].reverse().find(isRaidDay)?.date ?? days[0]?.date ?? null;
}

export default function StatsClient({
  today,
  initialPeriod,
  initialMonth,
  initialMonthly,
  initialRaids,
  rosterComposition,
  classArchetypeStats,
  sealGradeStats,
  inventoryStock,
}: {
  today: string;
  initialPeriod: Period;
  initialMonth: MonthStats;
  initialMonthly: MonthlyAttendance;
  initialRaids: DailyRaidStat[];
  rosterComposition: RosterClassStat[];
  classArchetypeStats: ClassArchetypeStat[];
  sealGradeStats: SealGradeStat[];
  inventoryStock: InventoryStockStat[];
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const [month, setMonth] = useState(initialMonth);
  const [monthLoading, setMonthLoading] = useState(false);
  const [monthlyYear, setMonthlyYear] = useState(initialPeriod.year);
  const [monthly, setMonthly] = useState(initialMonthly);
  const [view, setView] = useState<AttendanceView>("day");
  const [selectedDate, setSelectedDate] = useState<string | null>(today);
  const [raids, setRaids] = useState(initialRaids);
  const [raidsLoading, setRaidsLoading] = useState(false);
  const monthRequest = useRef(0);
  const raidsRequest = useRef(0);

  const latest = initialPeriod;
  const canGoBack = period.year > FIRST_YEAR || period.month > 0;
  const canGoForward = !samePeriod(period, latest);

  const loadRaids = (date: string | null) => {
    const request = ++raidsRequest.current;
    setSelectedDate(date);
    if (!date) {
      setRaids([]);
      return;
    }
    setRaidsLoading(true);
    getRaidsByDay(date)
      .then((data) => {
        if (request === raidsRequest.current) setRaids(data);
      })
      .catch(() => toast.error("Не удалось загрузить рейды"))
      .finally(() => {
        if (request === raidsRequest.current) setRaidsLoading(false);
      });
  };

  const changePeriod = (next: Period) => {
    const request = ++monthRequest.current;
    setPeriod(next);
    setMonthLoading(true);
    loadMonth(next)
      .then((data) => {
        if (request !== monthRequest.current) return;
        setMonth(data);
        loadRaids(defaultDate(next, today, data.daily));
      })
      .catch(() => toast.error("Не удалось загрузить статистику"))
      .finally(() => {
        if (request === monthRequest.current) setMonthLoading(false);
      });
  };

  useEffect(() => {
    if (monthlyYear === period.year) return;
    let cancelled = false;
    Promise.all([
      getGuildPrimeStatsByYear(period.year),
      getGuildAglStatsByYear(period.year),
    ])
      .then(([prime, agl]) => {
        if (cancelled) return;
        setMonthly(mergeMonthlyAttendance(prime, agl));
        setMonthlyYear(period.year);
      })
      .catch(() => toast.error("Не удалось загрузить посещаемость по месяцам"));
    return () => {
      cancelled = true;
    };
  }, [period.year, monthlyYear]);

  const days = fillMonth(period, month.daily);
  const rosterTotal =
    rosterComposition.find((row) => row.className === "Общее")?.count ?? null;

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Статистика
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Посещаемость, доход и состав гильдии за выбранный месяц.
          </p>
        </div>
        <div
          aria-label="Период"
          className="inline-flex items-center rounded-lg border bg-card"
        >
          <button
            type="button"
            aria-label="Предыдущий месяц"
            disabled={!canGoBack}
            onClick={() => changePeriod(shiftPeriod(period, -1))}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="min-w-36 text-center font-semibold tabular-nums">
            {periodLabel(period)}
          </span>
          <button
            type="button"
            aria-label="Следующий месяц"
            disabled={!canGoForward}
            onClick={() => changePeriod(shiftPeriod(period, 1))}
            className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        className={
          monthLoading
            ? "pointer-events-none opacity-60 transition-opacity"
            : ""
        }
      >
        <div className="flex flex-col gap-4">
          <StatsKpis
            days={days}
            previousDaily={month.previousDaily}
            income={month.income}
            previousIncome={month.previousIncome}
            rosterCount={rosterTotal}
          />

          <div className="grid items-start gap-4 min-[960px]:grid-cols-[minmax(0,1fr)_360px]">
            <AttendanceCard
              view={view}
              onViewChange={setView}
              days={days}
              monthly={monthly}
              year={period.year}
              selectedDate={selectedDate}
              onSelectDate={loadRaids}
              onSelectMonth={(index) => {
                const isFuture =
                  period.year * 12 + index > latest.year * 12 + latest.month;
                if (isFuture) return;
                setView("day");
                if (index !== period.month) {
                  changePeriod({ year: period.year, month: index });
                }
              }}
            />
            <DayRaidsCard
              date={selectedDate}
              raids={raids}
              loading={raidsLoading}
            />
          </div>

          <BossIncomeCard data={month.income} />
        </div>
      </div>

      <CompositionCard
        rosterComposition={rosterComposition}
        classArchetypeStats={classArchetypeStats}
        sealGradeStats={sealGradeStats}
        inventoryStock={inventoryStock}
      />
    </div>
  );
}
