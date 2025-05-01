"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Создаёт событие рейда с участниками
 *
 * @param type Тип рейда (например, raid.type.prime)
 * @param boss_name Имя босса (например, raid.boss_name.kaleil)
 * @param dkp_summary Сколько DKP в сумме
 * @param start_date Дата рейда
 * @param userIds Массив ID пользователей, которые участвовали
 */

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[]
) => {
  const event = await prisma.raid.create({
    data: {
      type,
      dkp_summary,
      start_date,
      created_at: new Date(),
      attendance: {
        create: userIds.map((user_id) => ({
          user_id,
          created_at: new Date(),
        })),
      },
      bosses: {
        connect: bossIds.map((id) => ({ id })),
      },
    },
    include: {
      attendance: true,
      bosses: true,
    },
  });

  return event;
};

export default createRaidEvent;
