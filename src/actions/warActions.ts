"use server";

import sql from "@/shared/lib/db";
import { UTILITY_ITEM_NAMES } from "@/shared/config/lootUtilityItems";
import { MISC_LOOT_ITEM_NAMES } from "@/widgets/Loot/GuildLoot/LootTypes";

export type PeriodAttendanceEntry = {
  userId: number;
  username: string;
  raidsAttended: number; // взвешено: is_late ? 0.5 : 1
};

export type PeriodAttendanceResult = {
  top: PeriodAttendanceEntry[];
  participantsCount: number; // сколько разных игроков был хотя бы на одном рейде за период
  totalRaidsInPeriod: number;
};

// Топ по посещаемости за произвольный период (вар/фришка): тот же паттерн
// запроса, что в computeMonthlyAttendanceForUsers (getAllUsersActivityWithPercent.ts),
// но по датам периода, а не по календарному месяцу. endedAt = null — период ещё
// идёт, считаем "с startedAt по сейчас".
export async function getPeriodAttendanceTop(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodAttendanceResult> {
  let rows;
  try {
    rows = endedAt
      ? await sql<any[]>`
          SELECT r.id, ra.user_id, ra.is_late, u.username
          FROM raid r
          LEFT JOIN raid_attendance ra ON ra.raid_id = r.id
          LEFT JOIN "user" u ON u.id = ra.user_id
          WHERE r.start_date >= ${startedAt} AND r.start_date < ${endedAt}
        `
      : await sql<any[]>`
          SELECT r.id, ra.user_id, ra.is_late, u.username
          FROM raid r
          LEFT JOIN raid_attendance ra ON ra.raid_id = r.id
          LEFT JOIN "user" u ON u.id = ra.user_id
          WHERE r.start_date >= ${startedAt}
        `;
  } catch (error) {
    console.error("Ошибка при получении посещаемости за период:", error);
    throw new Error("Не удалось получить посещаемость за период");
  }

  const raidIds = new Set<number>();
  const byUser = new Map<number, { username: string; weight: number }>();

  for (const row of rows) {
    raidIds.add(row.id);
    if (row.user_id === null) continue;
    const weight = row.is_late ? 0.5 : 1;
    const entry = byUser.get(row.user_id) ?? {
      username: row.username ?? "?",
      weight: 0,
    };
    entry.weight += weight;
    byUser.set(row.user_id, entry);
  }

  const sorted = Array.from(byUser.entries())
    .map(([userId, v]) => ({
      userId,
      username: v.username,
      raidsAttended: v.weight,
    }))
    .sort((a, b) => b.raidsAttended - a.raidsAttended);
  const top = limit ? sorted.slice(0, limit) : sorted;

  return {
    top,
    participantsCount: byUser.size,
    totalRaidsInPeriod: raidIds.size,
  };
}

// ── Экономика фришки ────────────────────────────────────────────────────
// Реальные данные из loot/item_type/misc_loot_totals за произвольный период.
// "Топ по вложениям в казну" сюда не входит — в базе нет игрока, который
// занёс лут в казну (запись "В казну" — ручная строка дохода без user_id),
// поэтому вместо него ниже топ ИСТОЧНИКОВ дохода (боссы/источники).

function moscowYearMonth(date: Date): { year: number; month: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  return {
    year: Number(parts.find((p) => p.type === "year")!.value),
    month: Number(parts.find((p) => p.type === "month")!.value),
  };
}

// Границы календарного месяца в московском времени (у Москвы нет перехода
// на летнее с 2014 — фиксированный +03:00), как моменты в мс.
function moscowMonthBoundsMs(year: number, month: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  const startMs = new Date(`${year}-${pad(month)}-01T00:00:00+03:00`).getTime();
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;
  const endMs = new Date(
    `${nextYear}-${pad(nextMonth)}-01T00:00:00+03:00`,
  ).getTime();
  return { startMs, endMs };
}

function moscowMonthsBetween(
  startMs: number,
  endMs: number,
): { year: number; month: number }[] {
  const start = moscowYearMonth(new Date(startMs));
  const end = moscowYearMonth(new Date(endMs));
  const months: { year: number; month: number }[] = [];
  let { year, month } = start;
  while (year < end.year || (year === end.year && month <= end.month)) {
    months.push({ year, month });
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

// Эссенции акхиума / Всякие мелочи / Всякие мелочи 2 не заводятся как
// обычные строки лута с источником — их доход ведётся помесячной суммой в
// misc_loot_totals (см. MISC_LOOT_ITEM_NAMES, MiscLootSummary), без дня
// сделки. Для произвольного периода прорачиваем каждый затронутый месяц по
// доле дней, попавших в период.
async function getMiscIncomeForPeriod(
  startedAt: string,
  rangeEnd: string,
): Promise<number> {
  const startMs = new Date(startedAt).getTime();
  const endMs = new Date(rangeEnd).getTime();
  const months = moscowMonthsBetween(startMs, endMs);
  if (months.length === 0) return 0;

  try {
    const first = months[0];
    const last = months[months.length - 1];
    const miscRows = await sql<any[]>`
      SELECT year, month, COALESCE(SUM(amount), 0) AS amount
      FROM misc_loot_totals
      WHERE item_name = ANY(${MISC_LOOT_ITEM_NAMES})
        AND make_date(year, month, 1) >= make_date(${first.year}, ${first.month}, 1)
        AND make_date(year, month, 1) <= make_date(${last.year}, ${last.month}, 1)
      GROUP BY year, month
    `;
    let total = 0;
    for (const row of miscRows) {
      const bounds = moscowMonthBoundsMs(row.year, row.month);
      const overlapMs = Math.max(
        0,
        Math.min(bounds.endMs, endMs) - Math.max(bounds.startMs, startMs),
      );
      const totalMs = bounds.endMs - bounds.startMs;
      const fraction = totalMs > 0 ? overlapMs / totalMs : 0;
      total += Number(row.amount) * fraction;
    }
    return total;
  } catch (error) {
    console.error("Ошибка при получении дохода с мелочей за период:", error);
    return 0;
  }
}

export type PeriodFinanceSummary = {
  totalEarned: number; // валовый доход за период: продажи лута + "в казну" + прората по "мелочам"
  itemsSoldCount: number; // сколько предметов реально купили игроки (без "в казну")
};

// misc_loot_totals хранит доход только помесячно (month, year), без дня —
// точный день сделки там не пишется. Для произвольного периода прорачиваем
// каждый затронутый месяц по доле дней, попавших в период.
export async function getPeriodFinanceSummary(
  startedAt: string,
  endedAt: string | null,
): Promise<PeriodFinanceSummary> {
  const rangeEnd = endedAt ?? new Date().toISOString();

  let lootRows: { status: string; income: number; qty: number }[] = [];
  try {
    // income — по всем проданным строкам (эссенции — тоже реальное золото).
    // qty — только "настоящие" предметы: без служебных строк (В казну и т.п.)
    // и без эссенций/расходников — те продаются пачками по 100 000+ штук и
    // полностью забивали бы счётчик "куплено предметов" бессмысленным числом.
    lootRows = await sql<any[]>`
      SELECT l.status,
        COALESCE(SUM(l.price), 0) AS income,
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

  const sales = lootRows.find((r) => r.status === "Продано");
  const treasury = lootRows.find((r) => r.status === "В казну");
  const lootIncome = Number(sales?.income ?? 0) + Number(treasury?.income ?? 0);
  const itemsSoldCount = Number(sales?.qty ?? 0);

  const miscIncomeEstimate = await getMiscIncomeForPeriod(startedAt, rangeEnd);

  return {
    totalEarned: Math.round(lootIncome + miscIncomeEstimate),
    itemsSoldCount,
  };
}

export type PeriodSaleEntry = {
  itemName: string;
  iconUrl: string | null;
  grade: number | null;
  price: number;
  buyerUsername: string | null;
};

// Топ ПРОДАЖ — самые дорогие отдельные сделки за период (не агрегат по
// покупателю): предмет + цена + кому продали. Заменяет "топ покупателей
// лута" — сумма покупок по игроку интереснее видеть тут как "кто чаще всего
// в топе продаж", а не отдельным топом.
export async function getPeriodTopSales(
  startedAt: string,
  endedAt: string | null,
  limit: number = 5,
): Promise<PeriodSaleEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    // sold_to_user_id часто пустой даже у проданных лотов — крупные продажи
    // это нередко аукцион/рандом среди гильдии без привязки к конкретному
    // user_id (см. l.sold_to: "Аук"/"Рандом" и т.п. свободным текстом),
    // поэтому берём username, только если реальной привязки нет — свободный
    // текст sold_to как есть.
    const rows = await sql<any[]>`
      SELECT l.price, it.name AS item_name, it.icon_url, it.grade,
        COALESCE(u.username, l.sold_to) AS buyer
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      LEFT JOIN "user" u ON u.id = l.sold_to_user_id
      WHERE l.status = 'Продано'
        AND l.sold_at >= ${startedAt} AND l.sold_at < ${rangeEnd}
      ORDER BY l.price DESC
      LIMIT ${limit}
    `;
    return rows.map((r) => ({
      itemName: r.item_name,
      iconUrl: r.icon_url ?? null,
      grade: r.grade ?? null,
      price: Number(r.price),
      buyerUsername: r.buyer ?? null,
    }));
  } catch (error) {
    console.error("Ошибка при получении топа продаж:", error);
    return [];
  }
}

export type PeriodIncomeSourceEntry = {
  source: string;
  income: number;
};

// Топ ИСТОЧНИКОВ дохода (боссы/источники, не игроки) — заменяет "топ по
// вложениям в казну", для которого в базе нет данных по игрокам. Без limit —
// источников обычно немного (боссы), показываем все.
export async function getPeriodTopIncomeSources(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodIncomeSourceEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  let entries: PeriodIncomeSourceEntry[] = [];
  try {
    const rows = await sql<any[]>`
      SELECT source, SUM(price) AS income
      FROM loot
      WHERE status IN ('Продано', 'В казну')
        AND sold_at >= ${startedAt} AND sold_at < ${rangeEnd}
        AND source IS NOT NULL AND source != ''
      GROUP BY source
      ORDER BY income DESC
    `;
    entries = rows.map((r) => ({ source: r.source, income: Number(r.income) }));
  } catch (error) {
    console.error("Ошибка при получении топа источников дохода:", error);
  }

  // Всякие мелочи / Всякие мелочи 2 / Эссенции акхиума не заводятся как
  // строки лута с источником (см. MISC_LOOT_ITEM_NAMES, MiscLootSummary) —
  // без этого блока их доход вообще не попадал бы в разбивку по источникам,
  // хотя "Заработано за период" (getPeriodFinanceSummary) его уже учитывает.
  // Это фарм-доход не от конкретного босса, поэтому приплюсовываем к "АГЛ",
  // как и в getBossIncomeByMonth.
  const miscIncome = Math.round(await getMiscIncomeForPeriod(startedAt, rangeEnd));
  if (miscIncome) {
    const aglEntry = entries.find((e) => e.source === "АГЛ");
    if (aglEntry) {
      aglEntry.income += miscIncome;
    } else {
      entries.push({ source: "АГЛ", income: miscIncome });
    }
    entries.sort((a, b) => b.income - a.income);
  }

  return limit ? entries.slice(0, limit) : entries;
}

export type PeriodDropEntry = {
  itemName: string;
  quantity: number;
  iconUrl: string | null;
  grade: number | null;
};

export type WarEconomySnapshot = {
  finance: PeriodFinanceSummary;
  topSales: PeriodSaleEntry[];
  incomeSources: PeriodIncomeSourceEntry[];
  drops: PeriodDropEntry[];
};

// Сколько каких предметов выбили с боссов за период (loot.source покрывает
// все дропы, а не только 5 "прайм"-боссов с привязкой к raid_id — см.
// комментарий в getPeriodTopIncomeSources выше про источники). Без limit —
// все предметы, не только топ-N (нужно видеть полную картину дропа).
export async function getPeriodTopDrops(
  startedAt: string,
  endedAt: string | null,
  limit?: number,
): Promise<PeriodDropEntry[]> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    const rows = limit
      ? await sql<any[]>`
          SELECT it.name AS item_name, SUM(l.quantity) AS quantity,
            MIN(it.icon_url) AS icon_url, MIN(it.grade) AS grade
          FROM loot l
          JOIN item_type it ON it.id = l.item_type_id
          WHERE l.acquired_at >= ${startedAt} AND l.acquired_at < ${rangeEnd}
            AND it.name != ALL(${UTILITY_ITEM_NAMES})
            AND it.name NOT ILIKE 'Эссенц%'
          GROUP BY it.name
          ORDER BY quantity DESC
          LIMIT ${limit}
        `
      : await sql<any[]>`
          SELECT it.name AS item_name, SUM(l.quantity) AS quantity,
            MIN(it.icon_url) AS icon_url, MIN(it.grade) AS grade
          FROM loot l
          JOIN item_type it ON it.id = l.item_type_id
          WHERE l.acquired_at >= ${startedAt} AND l.acquired_at < ${rangeEnd}
            AND it.name != ALL(${UTILITY_ITEM_NAMES})
            AND it.name NOT ILIKE 'Эссенц%'
          GROUP BY it.name
          ORDER BY quantity DESC
        `;
    return rows.map((r) => ({
      itemName: r.item_name,
      quantity: Number(r.quantity),
      iconUrl: r.icon_url ?? null,
      grade: r.grade ?? null,
    }));
  } catch (error) {
    console.error("Ошибка при получении топа выпавших предметов:", error);
    return [];
  }
}

export type PeriodMembershipEntry = {
  userId: number;
  username: string;
  at: string; // когда вступил ("user".joined_at) или ушёл ("user".inactive_since)
};

export type PeriodMembershipChanges = {
  joined: PeriodMembershipEntry[];
  left: PeriodMembershipEntry[];
};

// Кто вступил в гильдию и кто ушёл за период — не привязано к режиму
// (вар/фришка), состав меняется независимо от того, что сейчас идёт.
// "Ушёл" = active стал false, inactive_since выставляется в этот момент
// (см. updateUser.ts) — реальное событие с датой, не догадка.
export async function getPeriodMembershipChanges(
  startedAt: string,
  endedAt: string | null,
): Promise<PeriodMembershipChanges> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    const [joinedRows, leftRows] = await Promise.all([
      sql<any[]>`
        SELECT id, username, joined_at
        FROM "user"
        WHERE joined_at >= ${startedAt} AND joined_at < ${rangeEnd}
        ORDER BY joined_at
      `,
      sql<any[]>`
        SELECT id, username, inactive_since
        FROM "user"
        WHERE active = false
          AND inactive_since >= ${startedAt} AND inactive_since < ${rangeEnd}
        ORDER BY inactive_since
      `,
    ]);
    return {
      joined: joinedRows.map((r) => ({
        userId: r.id,
        username: r.username,
        at: r.joined_at,
      })),
      left: leftRows.map((r) => ({
        userId: r.id,
        username: r.username,
        at: r.inactive_since,
      })),
    };
  } catch (error) {
    console.error(
      "Ошибка при получении изменений состава гильдии за период:",
      error,
    );
    return { joined: [], left: [] };
  }
}
