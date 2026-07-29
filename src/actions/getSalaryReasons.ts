"use server";

import supabase from "@/shared/lib/supabase";
import { computeUserSalaryWeight } from "./financeActions";

export async function getSalaryReasons(month: number, year: number) {
  const { data: users, error } = await supabase
    .from("user")
    .select("id, joined_at, active, is_eligible_for_salary");

  if (error || !users) {
    console.error("Ошибка при получении причин отказа в зарплате:", error);
    return {};
  }

  const results = await Promise.all(
    users.map((user) => computeUserSalaryWeight(user, month, year)),
  );

  const reasons: Record<number, string> = {};
  for (const r of results) {
    if (!r.eligible && r.reason) {
      reasons[r.userId] = r.reason;
    }
  }
  return reasons;
}
