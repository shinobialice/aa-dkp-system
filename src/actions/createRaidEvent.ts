"use server";
import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";
import { getMoscowISOString, getMoscowYearMonth } from "@/utils/getMoscowISOString";

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  bonusTypeIds: number[],
  lateUserIds: number[] = [],
) => {
  await ensurePrivilieges([
    "Администратор",
    "Raid Manager",
    "Модератор",
    "Секретутка",
  ]);

  let activeUsers;
  try {
    activeUsers = await sql<any[]>`
      SELECT id FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch (activeError) {
    console.error("Failed to fetch active users:", activeError);
    throw new Error("Ошибка при определении активного состава");
  }

  const active_user_count = activeUsers.length;

  let raid;
  try {
    [raid] = await sql<any[]>`
      INSERT INTO raid
        (type, dkp_summary, start_date, created_at, active_user_count)
      VALUES (
        ${type}, ${dkp_summary}, ${getMoscowISOString(start_date)}, now(), ${active_user_count}
      )
      RETURNING *
    `;
  } catch (raidError) {
    console.error("Failed to create raid:", raidError);
    throw new Error("Ошибка при создании рейда");
  }

  if (!raid) {
    console.error("Failed to create raid: not returned");
    throw new Error("Ошибка при создании рейда");
  }

  if (userIds.length > 0) {
    const attendanceData = userIds.map((user_id) => ({
      raid_id: raid.id,
      user_id,
      created_at: new Date().toISOString(),
      is_late: lateUserIds.includes(user_id),
    }));

    try {
      await sql<any[]>`INSERT INTO raid_attendance ${sql(attendanceData)}`;
    } catch (attendanceError) {
      console.error("Failed to insert raid attendance:", attendanceError);
      throw new Error("Ошибка при добавлении участников");
    }
  }

  if (bossIds.length > 0) {
    const bossData = bossIds.map((boss_id) => ({ raid_id: raid.id, boss_id }));

    try {
      await sql<any[]>`INSERT INTO raid_boss ${sql(bossData)}`;
    } catch (bossError) {
      console.error("Failed to insert raid bosses:", bossError);
      throw new Error("Ошибка при добавлении боссов");
    }
  }

  if (bonusTypeIds.length > 0) {
    const bonusData = bonusTypeIds.map((bonus_type_id) => ({
      raid_id: raid.id,
      bonus_type_id,
    }));

    try {
      await sql<any[]>`INSERT INTO raid_bonus ${sql(bonusData)}`;
    } catch (bonusError) {
      console.error("Failed to insert raid bonuses:", bonusError);
      throw new Error("Ошибка при добавлении бонусов");
    }
  }

  // Посещаемость влияет на веса зарплат за месяц рейда (см. generateSalaries)
  // — пересчитываем сразу, не дожидаясь таймера на /loot/finance.
  const { year: recalcYear, month: recalcMonth } = getMoscowYearMonth(start_date);
  await triggerFinanceRecalc(recalcMonth, recalcYear);

  return raid;
};

export default createRaidEvent;
