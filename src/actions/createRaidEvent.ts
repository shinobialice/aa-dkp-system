"use server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Создаёт событие рейда с участниками
 *
 * @param type Тип рейда (например, raid.type.prime)
 * @param boss_name Имя босса (например, raid.boss_name.kaleil)
 * @param dkp_value Сколько DKP дают
 * @param start_date Дата рейда
 * @param userIds Массив ID пользователей, которые участвовали
 */

const createRaidEvent = async (
  type: string,
  boss_name: string,
  dkp_value: number,
  start_date: Date,
  userIds: number[]
) => {
  const event = await prisma.raid.create({
    data: {
      type,
      boss_name,
      dkp_value,
      start_date,
      created_at: new Date(),
      attendance: {
        create: userIds.map((user_id) => ({
          user_id,
          created_at: new Date(),
        })),
      },
    },
    include: {
      attendance: true,
    },
  });

  return event;
};

export default createRaidEvent;
