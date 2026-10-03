import "server-only";
import { computeMonthlyAttendanceForUsers } from "@/server/attendance";
import { getUserPenaltyPointsBatch } from "@/actions/penaltyActions";
import { getUserTagsBatch } from "@/actions/userTagsActions";
import sql from "@/shared/lib/db";
import type { GuildFundsRow, SalaryRow, UserRow } from "@/shared/lib/dbTypes";
import { grantSalaryAfterProbation } from "@/shared/lib/grantSalaryAfterProbation";
import { buildSalaryWeightResult } from "@/utils/buildSalaryWeightResult";
import getSalaryAsOfDate from "@/utils/getSalaryAsOfDate";
import {
  getCustomBonusBatch,
  getSalaryEligibilityContext,
} from "./salaryContext";

type EligibleUser = Pick<
  UserRow,
  | "id"
  | "joined_at"
  | "class"
  | "class_gear_score"
  | "active"
  | "inactive_since"
  | "probation_bypass"
>;

type Advance = Pick<SalaryRow, "sentAmount" | "sent">;

const NO_ATTENDANCE = {
  primePercent: 0,
  aglPercent: 0,
  totalPercent: 0,
  dkp: 0,
};

export async function generateSalaries(month: number, year: number) {
  const [fund] = await sql<Pick<GuildFundsRow, "salaryBudget">[]>`
    SELECT "salaryBudget" FROM "GuildFunds" WHERE month = ${month} AND year = ${year}
  `;
  if (!fund) throw new Error("Сначала нужно сгенерировать фонд");

  const asOf = getSalaryAsOfDate(month, year);
  await grantSalaryAfterProbation();

  const users = await usersActiveAt(asOf);
  if (users.length === 0) {
    throw new Error("Нет активных сотрудников для выплаты");
  }

  const context = await getSalaryEligibilityContext();
  const userIds = users.map((user) => user.id);
  const [attendanceMap, tagsMap, penaltyMap, bonusMap, advances] =
    await Promise.all([
      computeMonthlyAttendanceForUsers(users, month, year),
      getUserTagsBatch(userIds, asOf),
      getUserPenaltyPointsBatch(userIds),
      getCustomBonusBatch(userIds),
      advancesFor(month, year),
    ]);

  const weights = users.map((user) =>
    buildSalaryWeightResult(
      { ...user, active: true, is_eligible_for_salary: true },
      asOf,
      context,
      {
        attendance: attendanceMap[user.id] ?? NO_ATTENDANCE,
        tags: (tagsMap[user.id] ?? []).map((tag) => tag.tag),
        penaltyPoints: penaltyMap[user.id] ?? 0,
        individualBonusPercent: bonusMap[user.id] ?? 0,
      },
    ),
  );

  const eligible = weights.filter((row) => row.eligible);
  const totalWeight = eligible.reduce((sum, row) => sum + row.finalWeight, 0);
  const totalBasePoints = eligible.reduce(
    (sum, row) => sum + row.basePoints,
    0,
  );
  const share = (part: number, total: number) =>
    total ? Math.round((part / total) * fund.salaryBudget) : 0;

  const salaryRows = weights.map((row) => {
    const advance = advances.get(row.userId) ?? { sentAmount: 0, sent: false };
    // amount — базовая доля фонда без учёта бонусов/штрафов (для сравнения в
    // UI), total — фактическая выплата по итоговому весу.
    const amount = row.eligible ? share(row.basePoints, totalBasePoints) : 0;
    const total = row.eligible ? share(row.finalWeight, totalWeight) : 0;
    return {
      year,
      month,
      userId: row.userId,
      amount,
      bonus: total - amount,
      total,
      tenurePercent: row.tenureBonusPercent,
      customBonusPercent: row.individualBonusPercent,
      penaltyPercent: row.penaltyPercent,
      weightPercent: row.eligible ? row.finalWeight : 0,
      aglPercent: row.aglPercent,
      primePercent: row.primePercent,
      totalPercent: row.totalPercent,
      ...advance,
    };
  });

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM "Salary" WHERE month = ${month} AND year = ${year}`;
      await tx`INSERT INTO "Salary" ${tx(salaryRows)}`;
    });
  } catch (error) {
    console.error("Ошибка при генерации зарплат:", error);
    throw new Error("Ошибка при генерации зарплат");
  }
}

// Для прошлого месяца учитываем тех, кто был активен НА МОМЕНТ этого месяца
// (active сейчас, либо стал неактивным уже после asOf) — иначе человек,
// ушедший из гильдии позже, задним числом выпадал бы из уже выплаченной ЗП
// при любом пересчёте месяца (см. inactive_since в updateUser.ts).
async function usersActiveAt(asOf: Date) {
  const eligible = await sql<EligibleUser[]>`
    SELECT id, joined_at, class, class_gear_score, active, inactive_since, probation_bypass
    FROM "user"
    WHERE is_eligible_for_salary = true
  `;
  return eligible.filter(
    (user) =>
      user.active ||
      (user.inactive_since !== null && new Date(user.inactive_since) > asOf),
  );
}

async function advancesFor(month: number, year: number) {
  const rows = await sql<(Advance & Pick<SalaryRow, "userId">)[]>`
    SELECT "userId", "sentAmount", sent FROM "Salary" WHERE month = ${month} AND year = ${year}
  `;
  return new Map<number, Advance>(
    rows.map((row) => [
      row.userId,
      { sentAmount: row.sentAmount, sent: row.sent },
    ]),
  );
}
