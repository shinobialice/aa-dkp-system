"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import {
  computeUserSalaryWeight,
  getSalaryEligibilityContext,
} from "./financeActions";

export async function getSalaryReasons(month: number, year: number) {
  const { data: users, error } = await supabase
    .from("user")
    .select("id, joined_at, active, is_eligible_for_salary, class, class_gear_score");

  if (error || !users) {
    console.error("Ошибка при получении причин отказа в зарплате:", error);
    return {};
  }

  const context = await getSalaryEligibilityContext();

  const results = await Promise.all(
    users.map((user) => computeUserSalaryWeight(user, month, year, context)),
  );

  const reasons: Record<number, string> = {};
  for (const r of results) {
    if (!r.eligible && r.reason) {
      reasons[r.userId] = r.reason;
    }
  }
  return reasons;
}
