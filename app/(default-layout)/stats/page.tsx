"use client";

import DailyAttendanceChart from "@/src/components/statCharts/dailyAttendanceChart";
import MonthlyAttendanceChart from "@/src/components/statCharts/MonthlyAttendanceChart";
import { useState } from "react";

export default function StatsPage() {
  const currentDate = new Date();

  const [year2, setYear2] = useState(currentDate.getFullYear());
  const [month2, setMonth2] = useState(currentDate.getMonth());
  const [year3, setYear3] = useState(currentDate.getFullYear());

  return (
    <div className="p-6 space-y-6">
      <DailyAttendanceChart
        year={year2}
        month={month2}
        setYear={setYear2}
        setMonth={setMonth2}
      />
      <MonthlyAttendanceChart year={year3} setYear={setYear3} />
    </div>
  );
}
