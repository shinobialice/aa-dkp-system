"use server";

import sql from "@/shared/lib/db";
import type { RaidRow } from "@/shared/lib/dbTypes";
import {
  getMoscowISOString,
  getMoscowYearMonth,
} from "@/utils/getMoscowISOString";
import ensurePrivilieges from "./ensurePrivilieges";
import { insertRaidLinks, RAID_EDITOR_TAGS } from "@/server/raidLinks";
import { triggerFinanceRecalc } from "@/server/finance/recalc";

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  bonusTypeIds: number[],
  lateUserIds: number[] = [],
) => {
  await ensurePrivilieges(RAID_EDITOR_TAGS);

  let raid: RaidRow;
  try {
    raid = await sql.begin(async (tx) => {
      const [{ count }] = await tx<{ count: number }[]>`
        SELECT COUNT(*)::int AS count FROM "user"
        WHERE active = true
          AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
      `;

      const [created] = await tx<RaidRow[]>`
        INSERT INTO raid
          (type, dkp_summary, start_date, created_at, active_user_count)
        VALUES (
          ${type}, ${dkp_summary}, ${getMoscowISOString(start_date)}, now(), ${count}
        )
        RETURNING *
      `;

      await insertRaidLinks(tx, created.id, {
        userIds,
        lateUserIds,
        bossIds,
        bonusTypeIds,
      });
      return created;
    });
  } catch (error) {
    console.error("Failed to create raid:", error);
    throw new Error("Ошибка при создании рейда");
  }

  // Посещаемость влияет на веса зарплат за месяц рейда (см. generateSalaries)
  // — пересчитываем сразу, не дожидаясь таймера на /loot/finance.
  const { year, month } = getMoscowYearMonth(start_date);
  await triggerFinanceRecalc(month, year);

  return raid;
};

export default createRaidEvent;
