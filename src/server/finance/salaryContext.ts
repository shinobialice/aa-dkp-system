import "server-only";
import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import {
  getSalaryEligibilitySettings,
  type SalaryEligibilitySettings,
} from "@/actions/salaryEligibilitySettings";
import sql from "@/shared/lib/db";
import type { UserSalaryBonusRow } from "@/shared/lib/dbTypes";

// Критерии допуска и средний ГС по гильдии считаются один раз на весь расчёт,
// а не на каждого игрока — иначе это N одинаковых запросов настроек и N
// пересчётов среднего ГС по всей гильдии.
export type SalaryEligibilityContext = {
  settings: SalaryEligibilitySettings;
  averageGuildGS: number;
};

export async function getSalaryEligibilityContext(): Promise<SalaryEligibilityContext> {
  const settings = await getSalaryEligibilitySettings();
  const averageGuildGS = settings.gsEnabled ? await getAverageGuildGS() : 0;
  return { settings, averageGuildGS };
}

export async function getCustomBonusBatch(
  userIds: number[],
): Promise<Record<number, number>> {
  if (userIds.length === 0) return {};

  let rows: Pick<UserSalaryBonusRow, "user_id" | "amount">[];
  try {
    rows = await sql<Pick<UserSalaryBonusRow, "user_id" | "amount">[]>`
      SELECT user_id, amount FROM user_salary_bonus WHERE user_id = ANY(${userIds})
    `;
  } catch {
    return {};
  }

  const result: Record<number, number> = {};
  for (const row of rows) {
    result[row.user_id] = (result[row.user_id] ?? 0) + row.amount;
  }
  return result;
}
