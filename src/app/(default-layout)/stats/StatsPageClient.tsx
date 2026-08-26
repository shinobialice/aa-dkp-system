"use client";

import AttendanceTabsCard from "@/widgets/statCharts/AttendanceTabsCard";
import BossIncomeChart from "@/widgets/statCharts/BossIncomeChart";
import DailyRaidsCard from "@/widgets/statCharts/DailyRaidsCard";
import GuildInfoTabsCard from "@/widgets/statCharts/GuildInfoTabsCard";
import { useState } from "react";
import type {
  BossIncomeStat,
  DailyRaidStat,
  RosterClassStat,
  InventoryStockStat,
  SealGradeStat,
} from "@/actions/guildStats";
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
  initialRosterComposition,
  initialInventoryStock,
  initialSealGradeStats,
}: {
  initialYear: number;
  initialMonth: number;
  initialDailyData: ReturnType<typeof mergeDailyAttendance>;
  initialMonthlyData: ReturnType<typeof mergeMonthlyAttendance>;
  initialBossIncomeData: BossIncomeStat[];
  initialRaidsDate: string;
  initialRaidsData: DailyRaidStat[];
  initialRosterComposition: RosterClassStat[];
  initialInventoryStock: InventoryStockStat[];
  initialSealGradeStats: SealGradeStat[];
}) {
  const [year2, setYear2] = useState(initialYear);
  const [month2, setMonth2] = useState(initialMonth);
  const [year3, setYear3] = useState(initialYear);
  const [year4, setYear4] = useState(initialYear);
  const [month4, setMonth4] = useState(initialMonth + 1);

  return (
    <div className="p-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
      <AttendanceTabsCard
        dailyYear={year2}
        dailyMonth={month2}
        setDailyYear={setYear2}
        setDailyMonth={setMonth2}
        initialDailyData={initialDailyData}
        monthlyYear={year3}
        setMonthlyYear={setYear3}
        initialMonthlyData={initialMonthlyData}
      />
      <BossIncomeChart
        year={year4}
        month={month4}
        setYear={setYear4}
        setMonth={setMonth4}
        initialData={initialBossIncomeData}
      />
      <GuildInfoTabsCard
        rosterComposition={initialRosterComposition}
        sealGradeStats={initialSealGradeStats}
        inventoryStock={initialInventoryStock}
        className="self-start"
      />
      <DailyRaidsCard
        initialDate={initialRaidsDate}
        initialData={initialRaidsData}
      />
    </div>
  );
}
