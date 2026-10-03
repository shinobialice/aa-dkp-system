"use server";

import { miscIncomeForPeriod } from "@/server/periodMiscIncome";
import { UTILITY_ITEM_NAMES } from "@/shared/config/lootUtilityItems";
import sql from "@/shared/lib/db";

export type PeriodFinanceSummary = {
  totalEarned: number;
  itemsSoldCount: number;
};

export type PeriodSaleEntry = {
  itemName: string;
  iconUrl: string | null;
  grade: number | null;
  price: number;
  buyerUsername: string | null;
  buyerUserId: number | null;
};

export type PeriodBuyerEntry = {
  buyerUsername: string;
  buyerUserId: number;
  totalSpent: number;
  itemsCount: number;
};

export type PeriodIncomeSourceEntry = { source: string; income: number };

export type PeriodDropEntry = {
  itemName: string;
  quantity: number;
  iconUrl: string | null;
  grade: number | null;
};

export type WarEconomySnapshot = {
  finance: PeriodFinanceSummary;
  topSales: PeriodSaleEntry[];
  topBuyers: PeriodBuyerEntry[];
  incomeSources: PeriodIncomeSourceEntry[];
  drops: PeriodDropEntry[];
};

const MISC_INCOME_SOURCE = "АГЛ";

// totalEarned — валовый доход за период: продажи лута + "в казну" + прората
// по "мелочам". itemsSoldCount — только "настоящие" предметы: без служебных
// строк и без эссенций/расходников — те продаются пачками по 100 000+ штук и
// забивали бы счётчик "куплено предметов" бессмысленным числом.
export async function getPeriodFinanceSummary(
  startedAt: string,
  endedAt: string | null,
): Promise<PeriodFinanceSummary> {
  const rangeEnd = endedAt ?? new Date().toISOString();

  let lootRows: { status: string; income: number; qty: number }[] = [];
  try {
    lootRows = await sql<typeof lootRows>`
      SELECT l.status,
        COALESCE(SUM(l.price), 0)::float8 AS income,
        COALESCE(SUM(l.quantity) FILTER (
          WHERE it.name IS NULL
             OR (it.name NOT ILIKE 'Эссенц%' AND it.name != ALL(${UTILITY_ITEM_NAMES}))
        ), 0)::int AS qty
      FROM loot l
      LEFT JOIN item_type it ON it.id = l.item_type_id
      WHERE l.status IN ('Продано', 'В казну')
        AND l.sold_at >= ${startedAt} AND l.sold_at < ${rangeEnd}
      GROUP BY l.status
    `;
  } catch (error) {
    console.error("Ошибка при получении дохода от лута за период:", error);
  }

  const lootIncome = lootRows.reduce((sum, row) => sum + row.income, 0);
  const sales = lootRows.find((row) => row.status === "Продано");
  const miscIncome = await miscIncomeForPeriod(startedAt, rangeEnd);

  return {
    totalEarned: Math.round(lootIncome + miscIncome),
    itemsSoldCount: sales?.qty ?? 0,
  };
}

// Топ ПРОДАЖ — отдельные сделки (предмет + цена + кому продали). sold_to_user_id
// часто пустой даже у проданных лотов: крупные продажи — это нередко аукцион
// или рандом без привязки к игроку ("Аук"/"Рандом" свободным текстом), поэтому
// берём username, только если привязка есть, иначе sold_to как есть.
export async function getPeriodTopSales(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodSaleEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    return await sql<PeriodSaleEntry[]>`
      SELECT
        it.name AS "itemName", it.icon_url AS "iconUrl", it.grade,
        l.price::float8 AS price,
        COALESCE(u.username, l.sold_to) AS "buyerUsername", u.id AS "buyerUserId"
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      LEFT JOIN "user" u ON u.id = l.sold_to_user_id
      WHERE l.status = 'Продано'
        AND l.sold_at >= ${startedAt} AND l.sold_at < ${rangeEnd}
      ORDER BY l.price DESC
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
  } catch (error) {
    console.error("Ошибка при получении топа продаж:", error);
    return [];
  }
}

// Топ ПОКУПАТЕЛЕЙ — агрегат по игроку: сколько предметов и на какую сумму
// купил. Только реальные активные участники гильдии — продажи свободным
// текстом ("Аук"/"Рандом") сюда не попадают, в отличие от топа продаж.
export async function getPeriodTopBuyers(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodBuyerEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    return await sql<PeriodBuyerEntry[]>`
      SELECT u.id AS "buyerUserId", u.username AS "buyerUsername",
        SUM(l.price)::float8 AS "totalSpent", COUNT(*)::int AS "itemsCount"
      FROM loot l
      JOIN "user" u ON u.id = l.sold_to_user_id
      WHERE l.status = 'Продано'
        AND u.active = true
        AND l.sold_at >= ${startedAt} AND l.sold_at < ${rangeEnd}
      GROUP BY u.id, u.username
      ORDER BY "totalSpent" DESC
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
  } catch (error) {
    console.error("Ошибка при получении топа покупателей:", error);
    return [];
  }
}

// Топ ИСТОЧНИКОВ дохода (боссы, не игроки). "Мелочи" и эссенции не заводятся
// как лут с источником — без этого их доход не попадал бы в разбивку, хотя
// "Заработано за период" его уже учитывает. Это фарм-доход не от конкретного
// босса, поэтому приплюсовываем его к АГЛ, как и в доходе по боссам за месяц.
export async function getPeriodTopIncomeSources(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodIncomeSourceEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  let entries: PeriodIncomeSourceEntry[] = [];
  try {
    entries = await sql<PeriodIncomeSourceEntry[]>`
      SELECT source, SUM(price)::float8 AS income
      FROM loot
      WHERE status IN ('Продано', 'В казну')
        AND sold_at >= ${startedAt} AND sold_at < ${rangeEnd}
        AND source IS NOT NULL AND source != ''
      GROUP BY source
      ORDER BY income DESC
    `;
  } catch (error) {
    console.error("Ошибка при получении топа источников дохода:", error);
  }

  const miscIncome = Math.round(await miscIncomeForPeriod(startedAt, rangeEnd));
  const withMisc = miscIncome
    ? addIncome(entries, MISC_INCOME_SOURCE, miscIncome)
    : entries;
  return limit ? withMisc.slice(0, limit) : withMisc;
}

// Сколько каких предметов выбили с боссов за период — все предметы, не только
// топ-N: нужно видеть полную картину дропа.
export async function getPeriodTopDrops(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodDropEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    return await sql<PeriodDropEntry[]>`
      SELECT it.name AS "itemName", SUM(l.quantity)::int AS quantity,
        MIN(it.icon_url) AS "iconUrl", MIN(it.grade) AS grade
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      WHERE l.acquired_at >= ${startedAt} AND l.acquired_at < ${rangeEnd}
        AND it.name != ALL(${UTILITY_ITEM_NAMES})
        AND it.name NOT ILIKE 'Эссенц%'
      GROUP BY it.name
      ORDER BY quantity DESC
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
  } catch (error) {
    console.error("Ошибка при получении топа выпавших предметов:", error);
    return [];
  }
}

function addIncome(
  entries: PeriodIncomeSourceEntry[],
  source: string,
  income: number,
): PeriodIncomeSourceEntry[] {
  const hasSource = entries.some((entry) => entry.source === source);
  const merged = hasSource
    ? entries.map((entry) =>
        entry.source === source
          ? { ...entry, income: entry.income + income }
          : entry,
      )
    : [...entries, { source, income }];
  return merged.sort((a, b) => b.income - a.income);
}
