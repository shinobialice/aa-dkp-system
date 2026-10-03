import "server-only";
import sql from "@/shared/lib/db";
import { shiftYearMonth, type YearMonth } from "@/shared/config/months";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { MISC_LOOT_ITEM_NAMES } from "@/shared/config/miscLoot";

// misc_loot_totals хранит доход только помесячно (month, year), без дня —
// точный день сделки там не пишется. Для произвольного периода прорачиваем
// каждый затронутый месяц по доле времени, попавшей в период.
export async function miscIncomeForPeriod(startedAt: string, rangeEnd: string) {
  const startMs = new Date(startedAt).getTime();
  const endMs = new Date(rangeEnd).getTime();
  const months = monthsBetween(startMs, endMs);
  if (months.length === 0) return 0;

  const first = months[0];
  const last = months[months.length - 1];
  try {
    const rows = await sql<(YearMonth & { amount: number })[]>`
      SELECT year, month, COALESCE(SUM(amount), 0)::float8 AS amount
      FROM misc_loot_totals
      WHERE item_name = ANY(${MISC_LOOT_ITEM_NAMES})
        AND make_date(year, month, 1) >= make_date(${first.year}, ${first.month}, 1)
        AND make_date(year, month, 1) <= make_date(${last.year}, ${last.month}, 1)
      GROUP BY year, month
    `;
    return rows.reduce((total, row) => {
      const bounds = monthBoundsMs(row);
      const overlapMs = Math.max(
        0,
        Math.min(bounds.endMs, endMs) - Math.max(bounds.startMs, startMs),
      );
      const monthMs = bounds.endMs - bounds.startMs;
      return total + (monthMs > 0 ? row.amount * (overlapMs / monthMs) : 0);
    }, 0);
  } catch (error) {
    console.error("Ошибка при получении дохода с мелочей за период:", error);
    return 0;
  }
}

function monthBoundsMs(month: YearMonth) {
  const next = shiftYearMonth(month, 1);
  return {
    startMs: moscowMonthStart(month),
    endMs: moscowMonthStart(next),
  };
}

function moscowMonthStart({ year, month }: YearMonth) {
  const monthText = String(month).padStart(2, "0");
  return new Date(`${year}-${monthText}-01T00:00:00+03:00`).getTime();
}

function monthsBetween(startMs: number, endMs: number): YearMonth[] {
  const end = getMoscowYearMonth(new Date(endMs));
  const months: YearMonth[] = [];
  let cursor = getMoscowYearMonth(new Date(startMs));
  while (
    cursor.year < end.year ||
    (cursor.year === end.year && cursor.month <= end.month)
  ) {
    months.push(cursor);
    cursor = shiftYearMonth(cursor, 1);
  }
  return months;
}
