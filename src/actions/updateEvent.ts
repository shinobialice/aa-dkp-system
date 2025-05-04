"use server";

import { prisma } from "@/lib/db";

/**
 * Обновляет существующее событие по ID
 *
 * @param id ID события
 * @param type Тип события (например, "Прайм" или "АГЛ")
 * @param dkp_summary Суммарное значение DKP
 * @param start_date Дата и время начала
 * @param userIds Массив ID участников
 * @param bossIds Массив ID боссов
 * @param is_pvp Булево, было ли ПВП
 * @param is_pvp_long Булево, было ли ПВП > 30 минут
 */
const updateEvent = async (
  id: number,
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  is_pvp: boolean,
  is_pvp_long: boolean
) => {
  await prisma.raid.update({
    where: { id },
    data: {
      type,
      dkp_summary,
      start_date,
      is_pvp,
      is_pvp_long,
      attendance: {
        deleteMany: {}, // Удалить старых участников
        create: userIds.map((user_id) => ({
          user_id,
          created_at: new Date(),
        })),
      },
      raidBosses: {
        deleteMany: {}, // Удалить старых боссов
        create: bossIds.map((boss_id) => ({
          boss_id,
        })),
      },
    },
  });
};

export default updateEvent;
