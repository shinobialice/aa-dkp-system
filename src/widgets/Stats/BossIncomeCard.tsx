"use client";

import Image from "next/image";
import type { BossIncomeStat } from "@/actions/guildStats";
import { GOLD_ICON } from "../Loot/LootBuy/LootItemList";
import { formatNumber } from "./statsModel";

export default function BossIncomeCard({ data }: { data: BossIncomeStat[] }) {
  const rows = [...data].sort((a, b) => b.income - a.income);
  const max = rows[0]?.income ?? 0;
  const total = rows.reduce((sum, row) => sum + row.income, 0);

  return (
    <section className="flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold">Доход от боссов</h2>
        <span className="text-xs text-muted-foreground">
          продано из казны за месяц
        </span>
      </div>
      {rows.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Нет проданного лута за этот месяц
        </p>
      ) : (
        <>
          <div className="flex flex-col gap-2.5">
            {rows.map((row) => (
              <div
                key={row.boss}
                className="grid grid-cols-[minmax(4.5rem,6.5rem)_minmax(0,1fr)_auto] gap-x-2.5 sm:grid-cols-[minmax(5.5rem,10rem)_minmax(0,1fr)_auto] sm:gap-x-3 items-center gap-y-1"
              >
                <span className="truncate font-medium" title={row.boss}>
                  {row.boss}
                </span>
                <span className="h-[22px] overflow-hidden rounded-md bg-muted">
                  <span
                    className="block h-full rounded-md bg-gradient-to-r from-amber-400/70 to-amber-500"
                    style={{
                      width: `${max > 0 ? Math.max(2, (row.income / max) * 100) : 0}%`,
                    }}
                  />
                </span>
                <span className="min-w-20 text-right leading-tight tabular-nums">
                  <span className="block font-semibold">
                    {formatNumber(row.income)}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {row.itemsSold} предм.
                  </span>
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t pt-2.5 font-semibold">
            <span>Итого</span>
            <span className="flex items-center gap-1.5 tabular-nums">
              <Image src={GOLD_ICON} alt="" width={16} height={16} />
              {formatNumber(total)}
            </span>
          </div>
        </>
      )}
    </section>
  );
}
