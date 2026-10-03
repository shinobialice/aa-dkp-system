"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  getGuildAglStatsByYear,
  getGuildPrimeStatsByYear,
  getRaidsByDay,
  type BossIncomeStat,
  type ClassArchetypeStat,
  type DailyRaidStat,
  type InventoryStockStat,
  type RosterClassStat,
  type SealGradeStat,
} from "@/actions/guildStats";
import { mergeMonthlyAttendance } from "@/utils/mergeAttendanceSeries";
import AttendanceCard, { type AttendanceView } from "./AttendanceCard";
import BossIncomeCard from "./BossIncomeCard";
import CompositionCard from "./CompositionCard";
import DayRaidsCard from "./DayRaidsCard";
import StatsKpis from "./StatsKpis";
import {
  fillMonth,
  FIRST_YEAR,
  periodLabel,
  samePeriod,
  shiftPeriod,
  type DailyAttendance,
  type MonthlyAttendance,
  type Period,
} from "./statsModel";
import { loadMonth, defaultDate } from "./statsLoaders";
import PeriodSwitcher from "./PeriodSwitcher";

export type MonthStats = {
  daily: DailyAttendance;
  previousDaily: DailyAttendance;
  income: BossIncomeStat[];
  previousIncome: BossIncomeStat[];
};

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
          <h1 className="text-2xl font-bold tracking-tight">Статистика</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Посещаемость, доход и состав гильдии за выбранный месяц.
          </p>
        </div>
        <PeriodSwitcher
          label={periodLabel(period)}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          onShift={(delta) => changePeriod(shiftPeriod(period, delta))}
        />
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
