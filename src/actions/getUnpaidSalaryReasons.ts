"use server";

import sql from "@/shared/lib/db";
import { getSalaryReasons } from "./getSalaryReasons";
import type { SalaryWeightUser } from "@/utils/buildSalaryWeightResult";

export async function getUnpaidSalaryReasons(
  month: number,
  year: number,
  userIds: number[],
): Promise<Record<number, string>> {
  if (userIds.length === 0) return {};
  try {
    const users = await sql<SalaryWeightUser[]>`
      SELECT id, joined_at, active, is_eligible_for_salary, probation_bypass,
        class, class_gear_score
      FROM "user"
      WHERE id = ANY(${userIds})
    `;
    return await getSalaryReasons(month, year, users);
  } catch (error) {
    console.error("Ошибка при получении причин нулевой зарплаты:", error);
    return {};
  }
}
