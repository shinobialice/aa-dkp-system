"use client";

import DailyAttendanceChart from "@/widgets/statCharts/dailyAttendanceChart";
import MonthlyAttendanceChart from "@/widgets/statCharts/MonthlyAttendanceChart";
import BossIncomeChart from "@/widgets/statCharts/BossIncomeChart";
import DailyRaidsCard from "@/widgets/statCharts/DailyRaidsCard";
import { useState } from "react";
import type { BossIncomeStat, DailyRaidStat } from "@/actions/guildStats";
import type {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";

export default function StatsPageClient({
  initialYear,
  initialMonth,
  initialDailyData,
  initialMonthlyData,
  initialBossIncomeData,
  initialRaidsDate,
  initialRaidsData,
}: {
  initialYear: number;
  initialMonth: number;
  initialDailyData: ReturnType<typeof mergeDailyAttendance>;
  initialMonthlyData: ReturnType<typeof mergeMonthlyAttendance>;
  initialBossIncomeData: BossIncomeStat[];
  initialRaidsDate: string;
  initialRaidsData: DailyRaidStat[];
}) {
  const [year2, setYear2] = useState(initialYear);
  const [month2, setMonth2] = useState(initialMonth);
  const [year3, setYear3] = useState(initialYear);
  const [year4, setYear4] = useState(initialYear);
  const [month4, setMonth4] = useState(initialMonth + 1);

  return (
    <div className="p-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DailyAttendanceChart
        year={year2}
        month={month2}
        setYear={setYear2}
        setMonth={setMonth2}
        initialData={initialDailyData}
      />
      <MonthlyAttendanceChart
        year={year3}
        setYear={setYear3}
        initialData={initialMonthlyData}
      />
      <BossIncomeChart
        year={year4}
        month={month4}
        setYear={setYear4}
        setMonth={setMonth4}
        initialData={initialBossIncomeData}
      />
      <DailyRaidsCard
        initialDate={initialRaidsDate}
        initialData={initialRaidsData}
      />
    </div>
  );
}
