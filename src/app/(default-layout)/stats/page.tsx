"use client";

import DailyAttendanceChart from "@/widgets/statCharts/dailyAttendanceChart";
import MonthlyAttendanceChart from "@/widgets/statCharts/MonthlyAttendanceChart";
import BossIncomeChart from "@/widgets/statCharts/BossIncomeChart";
import { useState } from "react";

export default function StatsPage() {
  const currentDate = new Date();
  const [year2, setYear2] = useState(currentDate.getFullYear());
  const [month2, setMonth2] = useState(currentDate.getMonth());
  const [year3, setYear3] = useState(currentDate.getFullYear());
  const [year4, setYear4] = useState(currentDate.getFullYear());
  const [month4, setMonth4] = useState(currentDate.getMonth() + 1);

  return (
    <div className="p-6 space-y-6">
      <DailyAttendanceChart
        year={year2}
        month={month2}
        setYear={setYear2}
        setMonth={setMonth2}
      />
      <MonthlyAttendanceChart year={year3} setYear={setYear3} />
      <BossIncomeChart
        year={year4}
        month={month4}
        setYear={setYear4}
        setMonth={setMonth4}
      />
    </div>
  );
}
