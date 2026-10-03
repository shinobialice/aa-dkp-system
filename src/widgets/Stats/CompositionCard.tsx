"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import type {
  ClassArchetypeStat,
  InventoryStockStat,
  RosterClassStat,
  SealGradeStat,
} from "@/actions/guildStats";
import SealGradeStatsTable from "@/widgets/statCharts/SealGradeStatsTable";
import AvailableItemsTable from "@/widgets/statCharts/AvailableItemsTable";
import ClassArchetypeStatsTable from "@/widgets/statCharts/ClassArchetypeStatsTable";
import { PRIME_COLOR } from "./statsModel";
import { formatNumber } from "@/shared/lib/format";
import { Segmented } from "@/shared/ui";

type Tab = "roster" | "archetypes" | "seals" | "items";

const TOTAL_ROW = "Общее";
const LOW_ATTENDANCE = 65;

function RosterTable({ data }: { data: RosterClassStat[] }) {
  const classes = data.filter((row) => row.className !== TOTAL_ROW);
  const total = data.find((row) => row.className === TOTAL_ROW);
  const max = Math.max(1, ...classes.map((row) => row.count));

  const cells = (row: RosterClassStat, isTotal: boolean) => (
    <>
      <td className="px-2.5 py-2.5">
        {isTotal ? (
          row.count
        ) : (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-1.5 rounded-full"
              style={{
                width: `${(row.count / max) * 80}px`,
                backgroundColor: PRIME_COLOR,
              }}
            />
            {row.count}
          </span>
        )}
      </td>
      <td className="px-2.5 py-2.5 text-right">
        {row.avgGearScore != null ? formatNumber(row.avgGearScore, 0) : "—"}
      </td>
      <td
        className={cn(
          "px-2.5 py-2.5 text-right",
          !isTotal &&
            row.count > 0 &&
            row.avgAttendancePercent < LOW_ATTENDANCE &&
            "font-semibold text-red-600 dark:text-red-400",
        )}
      >
        {Math.round(row.avgAttendancePercent)}%
      </td>
      <td className="px-2.5 py-2.5 text-right">
        {row.salaryCount} из {row.count}
      </td>
    </>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse whitespace-nowrap tabular-nums">
        <thead className="text-2xs font-semibold tracking-wide text-muted-foreground uppercase">
          <tr className="border-b">
            <th className="px-2.5 py-2 text-left">Класс</th>
            <th className="px-2.5 py-2 text-left">Игроков</th>
            <th className="px-2.5 py-2 text-right">Средний ГС</th>
            <th className="px-2.5 py-2 text-right">Посещаемость</th>
            <th className="px-2.5 py-2 text-right">Получают зп</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((row) => (
            <tr key={row.className} className="border-b last:border-b-0">
              <td className="px-2.5 py-2.5 font-semibold">{row.className}</td>
              {cells(row, false)}
            </tr>
          ))}
        </tbody>
        {total && (
          <tfoot className="border-t-2 font-semibold">
            <tr>
              <td className="px-2.5 py-2.5">Всего</td>
              {cells(total, true)}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}

export default function CompositionCard({
  rosterComposition,
  classArchetypeStats,
  sealGradeStats,
  inventoryStock,
}: {
  rosterComposition: RosterClassStat[];
  classArchetypeStats: ClassArchetypeStat[];
  sealGradeStats: SealGradeStat[];
  inventoryStock: InventoryStockStat[];
}) {
  const [tab, setTab] = useState<Tab>("roster");

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">Состав гильдии</h2>
          <p className="text-xs text-muted-foreground">
            сейчас, не зависит от выбранного месяца
            {tab !== "roster" && " · наведите на строку, чтобы увидеть игроков"}
          </p>
        </div>
        <Segmented
          label="Раздел состава"
          value={tab}
          onChange={setTab}
          options={[
            { value: "roster", label: "Классы" },
            { value: "archetypes", label: "Архетипы" },
            { value: "seals", label: "Печати" },
            { value: "items", label: "Предметы" },
          ]}
        />
      </div>
      <div className="min-w-0 [&_[data-slot=card-content]]:px-0">
        {tab === "roster" && <RosterTable data={rosterComposition} />}
        {tab === "archetypes" && (
          <ClassArchetypeStatsTable bare data={classArchetypeStats} />
        )}
        {tab === "seals" && <SealGradeStatsTable bare data={sealGradeStats} />}
        {tab === "items" && <AvailableItemsTable bare data={inventoryStock} />}
      </div>
    </section>
  );
}
