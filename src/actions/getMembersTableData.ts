"use server";

import sql from "@/shared/lib/db";
import { computeMonthlyAttendanceForUsers } from "@/server/attendance";
import { resolveAvatarFrameUrls } from "@/server/avatarFrames";
import { getCurrentMonthSalaries } from "@/actions/getCurrentMonthSalaries";
import { getSalaryReasons } from "@/actions/getSalaryReasons";
import { getVkRealNames } from "@/shared/lib/vkNames";
import { grantSalaryAfterProbation } from "@/shared/lib/grantSalaryAfterProbation";
import type { UserRow } from "@/shared/lib/dbTypes";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";

type MemberRow = Pick<
  UserRow,
  | "id"
  | "username"
  | "avatar_url"
  | "class"
  | "secondary_class"
  | "tertiary_class"
  | "class_gear_score"
  | "joined_at"
  | "active"
  | "is_eligible_for_salary"
  | "probation_bypass"
  | "vk_id"
  | "vk_name"
  | "avatar_frame_id"
>;

const DAY_MS = 24 * 60 * 60 * 1000;
const EMPTY_ACTIVITY = { primePercent: 0, aglPercent: 0, totalPercent: 0 };

function vkLookupKey(user: Pick<UserRow, "vk_name" | "vk_id">) {
  return user.vk_name || (user.vk_id ? `id${user.vk_id}` : null);
}

export async function getMembersTableData() {
  await grantSalaryAfterProbation();

  let users: MemberRow[];
  try {
    users = await sql<MemberRow[]>`
      SELECT id, username, avatar_url, class, secondary_class, tertiary_class, class_gear_score, joined_at, active, is_eligible_for_salary, probation_bypass, vk_id, vk_name, avatar_frame_id
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
  const { month, year } = getMoscowYearMonth(now);

  const [activity, salaries, salaryReasons, vkRealNames, frameUrls] =
    await Promise.all([
      computeMonthlyAttendanceForUsers(users, month, year),
      getCurrentMonthSalaries(),
      getSalaryReasons(month, year, users),
      getVkRealNames(users.flatMap((user) => vkLookupKey(user) ?? [])),
      resolveAvatarFrameUrls(users),
    ]);

  return users.map((user) => {
    const act = activity[user.id] ?? EMPTY_ACTIVITY;
    const daysInGuild = user.joined_at
      ? Math.floor(
          (now.getTime() - new Date(user.joined_at).getTime()) / DAY_MS,
        )
      : 0;

    const vkKey = vkLookupKey(user);

    return {
      ...user,
      daysInGuild,
      joinedAtFormatted: user.joined_at
        ? new Date(user.joined_at).toLocaleDateString("ru-RU")
        : "-",
      salary: salaries[user.id] ?? null,
      salaryReason: salaryReasons[user.id] ?? null,
      vk_real_name: vkKey ? (vkRealNames[vkKey.toLowerCase()] ?? null) : null,
      avatar_frame_url: frameUrls.get(user.id) ?? null,
      ...act,
    };
  });
}
