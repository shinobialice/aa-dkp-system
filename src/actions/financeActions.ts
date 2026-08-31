"use server";
import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { generateGuildFunds } from "./generateGuildFunds";
import { computeMonthlyAttendanceForUsers } from "./getAllUsersActivityWithPercent";
import { getUserTagsBatch } from "./userTagsActions";
import { getUserPenaltyPointsBatch } from "./penaltyActions";
import { buildSalaryWeightResult } from "@/utils/buildSalaryWeightResult";
import getSalaryAsOfDate from "@/utils/getSalaryAsOfDate";
import { getAverageGuildGS } from "./getAverageGuildGS";
import {
  getSalaryEligibilitySettings,
  type SalaryEligibilitySettings,
} from "./salaryEligibilitySettings";

export const getGuildFunds = async (month: number, year: number) => {
  try {
    const [data] = await sql<any[]>`
      SELECT * FROM "GuildFunds" WHERE month = ${month} AND year = ${year}
    `;
    return data ?? null;
  } catch {
    throw new Error("Ошибка при получении фонда");
  }
};

export const getSalariesForMonth = async (month: number, year: number) => {
  let data;
  try {
    data = await sql<any[]>`
      SELECT s.*, u.username AS user_username, u.class AS user_class
      FROM "Salary" s
      LEFT JOIN "user" u ON u.id = s."userId"
      WHERE s.month = ${month} AND s.year = ${year}
    `;
  } catch {
    throw new Error("Ошибка при получении зарплат");
  }

  return data.map((s) => {
    const username = s.user_username ?? "Неизвестно";
    return {
      id: s.id,
      userId: s.userId,
      username: username ?? "Неизвестно",
      class: s.user_class ?? null,
      amount: s.amount,
      bonus: s.bonus,
      total: s.total,
      sentAmount: s.sentAmount ?? 0,
      sent: s.sent ?? false,
      tenurePercent: s.tenurePercent ?? 0,
      customBonusPercent: s.customBonusPercent ?? 0,
      penaltyPercent: s.penaltyPercent ?? 0,
      weightPercent: s.weightPercent ?? 0,
      aglPercent: s.aglPercent ?? 0,
      primePercent: s.primePercent ?? 0,
      totalPercent: s.totalPercent ?? 0,
    };
  });
};

export const updateSalaryAdvance = async (
  salaryId: number,
  sentAmount: number,
  sent: boolean,
) => {
  await ensurePrivilieges(["Администратор"]);

  let data;
  try {
    [data] = await sql<any[]>`
      UPDATE "Salary" SET "sentAmount" = ${sentAmount}, sent = ${sent}
      WHERE id = ${salaryId}
      RETURNING month, year
    `;
  } catch {
    throw new Error("Ошибка при обновлении аванса");
  }

  if (!data) {
    throw new Error("Ошибка при обновлении аванса");
  }

  // "Выслано авансом"/"В казне" в GuildFunds считаются от суммы
  // Salary.sentAmount (см. getLiveAdvanceSent в generateGuildFunds.ts) —
  // без этого пересчёта отметка "выслано" не отражалась бы на /loot/finance,
  // пока кто-нибудь не продаст лут/добавит рейд или не нажмёт "Пересчитать".
  // Веса зарплат аванс не меняет, поэтому пересчитываем только фонд, не всю
  // generateSalaries.
  try {
    await generateGuildFunds(data.month, data.year);
  } catch (err) {
    console.error("Ошибка при пересчёте фонда после изменения аванса:", err);
  }
};

// Батч-версия getCustomBonus — один запрос на всех переданных пользователей
// сразу (используется при расчёте причин отказа в ЗП для всей гильдии на
// странице /members, см. getSalaryReasons).
export async function getCustomBonusBatch(
  userIds: number[],
): Promise<Record<number, number>> {
  if (userIds.length === 0) return {};

  let data;
  try {
    data = await sql<any[]>`
      SELECT user_id, amount FROM user_salary_bonus WHERE user_id = ANY(${userIds})
    `;
  } catch {
    return {};
  }

  const result: Record<number, number> = {};
  for (const row of data ?? []) {
    result[row.user_id] = (result[row.user_id] ?? 0) + (row.amount || 0);
  }
  return result;
}

// Критерии допуска + средний ГС по гильдии считаются один раз на весь
// generateSalaries/getSalaryReasons, а не на каждого игрока — иначе это N
// одинаковых запросов настроек и N пересчётов среднего ГС по всей гильдии.
export type SalaryEligibilityContext = {
  settings: SalaryEligibilitySettings;
  averageGuildGS: number;
};

export async function getSalaryEligibilityContext(): Promise<SalaryEligibilityContext> {
  const settings = await getSalaryEligibilitySettings();
  const averageGuildGS = settings.gsEnabled ? await getAverageGuildGS() : 0;

  return { settings, averageGuildGS };
}

export const generateSalaries = async (month: number, year: number) => {
  const [fund] = await sql<any[]>`
    SELECT * FROM "GuildFunds" WHERE month = ${month} AND year = ${year}
  `;

  if (!fund) {
    throw new Error("Сначала нужно сгенерировать фонд");
  }

  const asOf = getSalaryAsOfDate(month, year);

  let allEligible;
  try {
    allEligible = await sql<any[]>`
      SELECT id, joined_at, class, class_gear_score, active, inactive_since, probation_bypass
      FROM "user"
      WHERE is_eligible_for_salary = true
    `;
  } catch {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  if (!allEligible || allEligible.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  // Для прошлого месяца учитываем тех, кто был активен НА МОМЕНТ этого
  // месяца (active сейчас, либо стал неактивным уже после asOf) — иначе
  // человек, ушедший из гильдии позже, задним числом выпадал бы из уже
  // выплаченной ЗП при любом пересчёте месяца (см. inactive_since в
  // updateUser.ts).
  const users = allEligible.filter(
    (u) => u.active || (u.inactive_since && new Date(u.inactive_since) > asOf),
  );

  if (users.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  const context = await getSalaryEligibilityContext();
  const userIds = users.map((u) => u.id);

  // Раньше здесь на каждого пользователя дергался отдельный
  // computeUserSalaryWeight (4 запроса на игрока, включая повторный запрос
  // всех рейдов месяца) — при вызове на каждое открытие /loot/finance и
  // каждые 60 сек автообновления это было особенно тяжело. Теперь — 4
  // запроса на всю гильдию разом (см. getSalaryReasons, где тот же фикс).
  const [attendanceMap, tagsMap, penaltyMap, bonusMap] = await Promise.all([
    computeMonthlyAttendanceForUsers(users, month, year),
    getUserTagsBatch(userIds, asOf),
    getUserPenaltyPointsBatch(userIds),
    getCustomBonusBatch(userIds),
  ]);

  const userRows = users.map((user) => {
    const attendance = attendanceMap[user.id] ?? {
      primePercent: 0,
      aglPercent: 0,
      totalPercent: 0,
      dkp: 0,
    };
    const tags = (tagsMap[user.id] ?? []).map((t) => t.tag);
    const penaltyPoints = penaltyMap[user.id] ?? 0;
    const individualBonusPercent = bonusMap[user.id] ?? 0;

    return buildSalaryWeightResult(
      { ...user, active: true, is_eligible_for_salary: true },
      asOf,
      context,
      { attendance, tags, penaltyPoints, individualBonusPercent },
    );
  });

  const eligibleRows = userRows.filter((r) => r.eligible);
  const totalWeight = eligibleRows.reduce((sum, r) => sum + r.finalWeight, 0);
  const totalBasePoints = eligibleRows.reduce(
    (sum, r) => sum + r.basePoints,
    0,
  );

  const existingSalaries = await sql<any[]>`
    SELECT "userId", "sentAmount", sent FROM "Salary" WHERE month = ${month} AND year = ${year}
  `;

  const advanceByUserId = new Map(
    (existingSalaries ?? []).map((s) => [
      s.userId,
      { sentAmount: s.sentAmount ?? 0, sent: s.sent ?? false },
    ]),
  );

  try {
    await sql<any[]>`DELETE FROM "Salary" WHERE month = ${month} AND year = ${year}`;
  } catch {
    throw new Error("Ошибка при удалении предыдущих зарплат");
  }

  const salaryRows = userRows.map((r) => {
    const prevAdvance = advanceByUserId.get(r.userId) ?? {
      sentAmount: 0,
      sent: false,
    };

    if (!r.eligible) {
      return {
        year,
        month,
        userId: r.userId,
        amount: 0,
        bonus: 0,
        total: 0,
        tenurePercent: r.tenureBonusPercent,
        customBonusPercent: r.individualBonusPercent,
        penaltyPercent: r.penaltyPercent,
        weightPercent: 0,
        aglPercent: r.aglPercent,
        primePercent: r.primePercent,
        totalPercent: r.totalPercent,
        ...prevAdvance,
      };
    }

    // amount — базовая доля фонда без учёта бонусов/штрафов (для сравнения в UI),
    // total — фактическая выплата по итоговому весу (basePoints с бонусами и штрафом).
    const amount = totalBasePoints
      ? Math.round((r.basePoints / totalBasePoints) * fund.salaryBudget)
      : 0;
    const total = totalWeight
      ? Math.round((r.finalWeight / totalWeight) * fund.salaryBudget)
      : 0;

    return {
      year,
      month,
      userId: r.userId,
      amount,
      bonus: total - amount,
      total,
      tenurePercent: r.tenureBonusPercent,
      customBonusPercent: r.individualBonusPercent,
      penaltyPercent: r.penaltyPercent,
      weightPercent: r.finalWeight,
      aglPercent: r.aglPercent,
      primePercent: r.primePercent,
      totalPercent: r.totalPercent,
      ...prevAdvance,
    };
  });

  try {
    await sql<any[]>`INSERT INTO "Salary" ${sql(salaryRows)}`;
  } catch {
    throw new Error("Ошибка при генерации зарплат");
  }
};
