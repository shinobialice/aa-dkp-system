"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { computeMonthlyAttendanceForUsers } from "@/actions/getAllUsersActivityWithPercent";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";

export async function getMembersTableData() {
  const { data: users, error } = await supabase
    .from("user")
    .select(
      "id, username, avatar_url, class, class_gear_score, joined_at, active, is_eligible_for_salary, probation_bypass",
    )
    .eq("active", true)
    .order("joined_at", { ascending: true })
    .order("is_eligible_for_salary", { ascending: false });

  if (error || !users) {
    console.error("Error loading users:", error);
    return null;
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [activity, salaries, salaryReasons] = await Promise.all([
    computeMonthlyAttendanceForUsers(users, month, year),
    getCurrentMonthSalaries(),
    getSalaryReasons(month, year, users),
  ]);

  return users.map((user) => {
    const act = activity[user.id] ?? {
      primePercent: 0,
      aglPercent: 0,
      totalPercent: 0,
    };

    const daysInGuild = user.joined_at
      ? Math.floor(
          (now.getTime() - new Date(user.joined_at).getTime()) /
            (1000 * 3600 * 24),
        )
      : 0;

    return {
      ...user,
      daysInGuild,
      joinedAtFormatted: user.joined_at
        ? new Date(user.joined_at).toLocaleDateString("ru-RU")
        : "-",
      salary: salaries[user.id] ?? null,
      salaryReason: salaryReasons[user.id] ?? null,
      ...act,
    };
  });
}
