"use server";

import { generateGuildFunds } from "@/server/finance/generateGuildFunds";
import sql from "@/shared/lib/db";
import type { GuildFundsRow, SalaryRow, UserRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";

type SalaryQueryRow = SalaryRow & {
  user_username: UserRow["username"] | null;
  user_class: UserRow["class"];
  user_avatar_url: UserRow["avatar_url"];
  user_joined_at: UserRow["joined_at"];
};

export type MonthSalary = Awaited<
  ReturnType<typeof getSalariesForMonth>
>[number];

export const getGuildFunds = async (month: number, year: number) => {
  try {
    const [fund] = await sql<GuildFundsRow[]>`
      SELECT * FROM "GuildFunds" WHERE month = ${month} AND year = ${year}
    `;
    return fund ?? null;
  } catch {
    throw new Error("Ошибка при получении фонда");
  }
};

export const getSalariesForMonth = async (month: number, year: number) => {
  let rows: SalaryQueryRow[];
  try {
    rows = await sql<SalaryQueryRow[]>`
      SELECT s.*, u.username AS user_username, u.class AS user_class,
        u.avatar_url AS user_avatar_url, u.joined_at AS user_joined_at
      FROM "Salary" s
      LEFT JOIN "user" u ON u.id = s."userId"
      WHERE s.month = ${month} AND s.year = ${year}
        AND s."userId" NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch {
    throw new Error("Ошибка при получении зарплат");
  }

  return rows.map((row) => ({
    id: row.id,
    userId: row.userId,
    username: row.user_username ?? "Неизвестно",
    class: row.user_class,
    avatarUrl: row.user_avatar_url,
    joinedAt: row.user_joined_at,
    amount: row.amount,
    bonus: row.bonus,
    total: row.total,
    sentAmount: row.sentAmount,
    sent: row.sent,
    tenurePercent: row.tenurePercent,
    customBonusPercent: row.customBonusPercent,
    penaltyPercent: row.penaltyPercent,
    weightPercent: row.weightPercent,
    aglPercent: row.aglPercent,
    primePercent: row.primePercent,
    totalPercent: row.totalPercent,
  }));
};

export const updateSalaryAdvance = async (
  salaryId: number,
  sentAmount: number,
  sent: boolean,
) => {
  await ensurePrivilieges(["Администратор"]);

  let updated: Pick<SalaryRow, "month" | "year"> | undefined;
  try {
    [updated] = await sql<Pick<SalaryRow, "month" | "year">[]>`
      UPDATE "Salary" SET "sentAmount" = ${sentAmount}, sent = ${sent}
      WHERE id = ${salaryId}
      RETURNING month, year
    `;
  } catch {
    throw new Error("Ошибка при обновлении аванса");
  }
  if (!updated) throw new Error("Ошибка при обновлении аванса");

  // "Выслано авансом"/"В казне" в GuildFunds считаются от суммы
  // Salary.sentAmount — без этого пересчёта отметка "выслано" не отражалась
  // бы на /loot/finance до следующего пересчёта. Веса зарплат аванс не
  // меняет, поэтому пересчитываем только фонд.
  try {
    await generateGuildFunds(updated.month, updated.year);
  } catch (error) {
    console.error("Ошибка при пересчёте фонда после изменения аванса:", error);
  }
};
