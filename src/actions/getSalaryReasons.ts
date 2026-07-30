"use server";

import {
  getCustomBonusBatch,
  getSalaryEligibilityContext,
} from "./financeActions";
import {
  buildSalaryWeightResult,
  type SalaryWeightUser,
} from "@/utils/buildSalaryWeightResult";
import getSalaryAsOfDate from "@/utils/getSalaryAsOfDate";
import { computeMonthlyAttendanceForUsers } from "./getAllUsersActivityWithPercent";
import { getUserTagsBatch } from "./userTagsActions";
import { getUserPenaltyPointsBatch } from "./penaltyActions";

// users передаются вызывающей стороной (страница /members уже один раз
// загрузила список игроков) — чтобы не запрашивать всю таблицу user ещё раз.
export async function getSalaryReasons(
  month: number,
  year: number,
  users: SalaryWeightUser[],
) {
  const context = await getSalaryEligibilityContext();
  const asOf = getSalaryAsOfDate(month, year);
  const userIds = users.map((u) => u.id);

  // Раньше здесь на каждого пользователя дергался отдельный
  // computeUserSalaryWeight (4 запроса на игрока, включая повторный запрос
  // всех рейдов месяца). Теперь всё это — 4 запроса на всю гильдию разом.
  const [attendanceMap, tagsMap, penaltyMap, bonusMap] = await Promise.all([
    computeMonthlyAttendanceForUsers(users, month, year),
    getUserTagsBatch(userIds, asOf),
    getUserPenaltyPointsBatch(userIds),
    getCustomBonusBatch(userIds),
  ]);

  const reasons: Record<number, string> = {};
  for (const user of users) {
    const attendance = attendanceMap[user.id] ?? {
      primePercent: 0,
      aglPercent: 0,
      totalPercent: 0,
      dkp: 0,
    };
    const tags = (tagsMap[user.id] ?? []).map((t) => t.tag);
    const penaltyPoints = penaltyMap[user.id] ?? 0;
    const individualBonusPercent = bonusMap[user.id] ?? 0;

    const r = buildSalaryWeightResult(user, asOf, context, {
      attendance,
      tags,
      penaltyPoints,
      individualBonusPercent,
    });

    if (!r.eligible && r.reason) {
      reasons[r.userId] = r.reason;
    }
  }

  return reasons;
}
