"use server";

import sql from "@/shared/lib/db";
import type { RaidRow } from "@/shared/lib/dbTypes";
import {
  getMoscowISOString,
  getMoscowYearMonth,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";
import ensurePrivilieges from "./ensurePrivilieges";
import {
  deleteRaidLinks,
  insertRaidLinks,
  RAID_EDITOR_TAGS,
} from "@/server/raidLinks";
import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";

const updateEvent = async (
  id: number,
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  bonusTypeIds: number[],
  lateUserIds: number[] = [],
) => {
  await ensurePrivilieges(RAID_EDITOR_TAGS);

  // Запоминаем старую дату — если рейд переносят в другой месяц, пересчитать
  // нужно оба месяца (у старого пропадает посещаемость/dkp, у нового — появляется).
  const [previousRaid] = await sql<Pick<RaidRow, "start_date">[]>`
    SELECT start_date FROM raid WHERE id = ${id}
  `;

  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE raid SET
          type = ${type},
          dkp_summary = ${dkp_summary},
          start_date = ${getMoscowISOString(start_date)}
        WHERE id = ${id}
      `;
      await deleteRaidLinks(tx, id);
      await insertRaidLinks(tx, id, {
        userIds,
        lateUserIds,
        bossIds,
        bonusTypeIds,
      });
    });
  } catch (error) {
    console.error("Ошибка при обновлении события:", error);
    throw new Error("Не удалось обновить событие");
  }
  await publishChanges("raids");

  // Посещаемость/dkp влияют на веса зарплат за месяц рейда — пересчитываем
  // сразу.
  const { year: newYear, month: newMonth } = getMoscowYearMonth(start_date);
  const monthsToRecalc = new Set([`${newYear}-${newMonth}`]);
  if (previousRaid?.start_date) {
    const previous = getMoscowYearMonth(
      parseMoscowISOString(previousRaid.start_date),
    );
    monthsToRecalc.add(`${previous.year}-${previous.month}`);
  }

  for (const key of monthsToRecalc) {
    const [year, month] = key.split("-").map(Number);
    await triggerFinanceRecalc(month, year);
  }
};

export default updateEvent;
