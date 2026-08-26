"use client";

import { Card, Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import DailyAttendanceChart from "./dailyAttendanceChart";
import MonthlyAttendanceChart from "./MonthlyAttendanceChart";
import type {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";

export default function AttendanceTabsCard({
  dailyYear,
  dailyMonth,
  setDailyYear,
  setDailyMonth,
  initialDailyData,
  monthlyYear,
  setMonthlyYear,
  initialMonthlyData,
}: {
  dailyYear: number;
  dailyMonth: number;
  setDailyYear: (val: number) => void;
  setDailyMonth: (val: number) => void;
  initialDailyData?: ReturnType<typeof mergeDailyAttendance>;
  monthlyYear: number;
  setMonthlyYear: (val: number) => void;
  initialMonthlyData?: ReturnType<typeof mergeMonthlyAttendance>;
}) {
  return (
    <Card className="py-4 gap-3">
      <Tabs defaultValue="daily">
        <div className="px-6">
          <TabsList>
            <TabsTrigger className="cursor-pointer" value="daily">
              Общая посещаемость по дням
            </TabsTrigger>
            <TabsTrigger className="cursor-pointer" value="monthly">
              Посещаемость по месяцам
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="daily">
          <DailyAttendanceChart
            bare
            year={dailyYear}
            month={dailyMonth}
            setYear={setDailyYear}
            setMonth={setDailyMonth}
            initialData={initialDailyData}
          />
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyAttendanceChart
            bare
            year={monthlyYear}
            setYear={setMonthlyYear}
            initialData={initialMonthlyData}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
