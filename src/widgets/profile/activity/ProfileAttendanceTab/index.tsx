"use client";

import { useMemo, useState } from "react";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import { getUserMonthlyRaids } from "@/actions/getUserMonthlyRaids";
import { useAsyncData } from "@/hooks/useAsyncData";
import { MONTH_NAMES } from "@/shared/config/months";
import AttendanceTiles from "./AttendanceTiles";
import PeriodPicker from "./PeriodPicker";
import RaidList from "./RaidList";
import { sortRaids, type RaidSort, type SortKey } from "./raidSort";

const YEARS_BACK = 3;
const YEAR_OPTIONS = 5;

export default function ProfileAttendanceTab({ userId }: { userId: number }) {
  const [now] = useState(() => new Date());
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [sort, setSort] = useState<RaidSort>({ key: "startDate", desc: true });

  const { data, isLoading } = useAsyncData(
    `${userId}-${year}-${month}`,
    async () => {
      const [attendance, raids] = await Promise.all([
        getUserMonthlyAttendance(userId, year, month + 1),
        getUserMonthlyRaids(userId, year, month + 1),
      ]);
      return { attendance, raids };
    },
  );

  const raids = useMemo(() => sortRaids(data?.raids ?? [], sort), [data, sort]);
  const years = Array.from(
    { length: YEAR_OPTIONS },
    (_, index) => now.getFullYear() - YEARS_BACK + index,
  );
  const period = `${MONTH_NAMES[month].toLowerCase()} ${year}`;

  const toggleSort = (key: SortKey) =>
    setSort((current) => ({
      key,
      desc: current.key === key ? !current.desc : true,
    }));

  return (
    <section
      aria-label="Посещаемость"
      className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Посещаемость за {period}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Проценты и рейды за выбранный месяц
          </p>
        </div>
        <PeriodPicker
          month={month}
          year={year}
          years={years}
          onMonthChange={setMonth}
          onYearChange={setYear}
        />
      </div>

      {(isLoading || !data) && (
        <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
          Загрузка…
        </div>
      )}
      {!isLoading && data && (
        <>
          <AttendanceTiles data={data.attendance} />
          {raids.length === 0 && (
            <p className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
              Нет посещённых рейдов за {period}
            </p>
          )}
          {raids.length > 0 && (
            <RaidList raids={raids} sort={sort} onSort={toggleSort} />
          )}
        </>
      )}
    </section>
  );
}
