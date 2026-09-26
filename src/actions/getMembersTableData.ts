"use server";

import sql from "@/shared/lib/db";
import { computeMonthlyAttendanceForUsers } from "@/actions/getAllUsersActivityWithPercent";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";
import { getVkRealNames } from "@/shared/lib/vkNames";
import { grantSalaryAfterProbation } from "@/shared/lib/grantSalaryAfterProbation";

export async function getMembersTableData() {
  await grantSalaryAfterProbation();

  let users;
  try {
    users = await sql<any[]>`
      SELECT id, username, avatar_url, class, class_gear_score, joined_at, active, is_eligible_for_salary, probation_bypass, vk_id, vk_name
      FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
      ORDER BY joined_at ASC, is_eligible_for_salary DESC
    `;
  } catch (error) {
    console.error("Error loading users:", error);
    return null;
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [activity, salaries, salaryReasons, vkRealNames] = await Promise.all([
    computeMonthlyAttendanceForUsers(users, month, year),
    getCurrentMonthSalaries(),
    getSalaryReasons(month, year, users),
    getVkRealNames(users.map((user) => user.vk_name).filter(Boolean)),
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
      vk_real_name: user.vk_name
        ? (vkRealNames[user.vk_name.toLowerCase()] ?? null)
        : null,
      ...act,
    };
  });
}
