"use server";
import prisma from "@/lib/db";

const createRaidEvent = async (
  type: string,
  dkp_summary: number,
  start_date: Date,
  userIds: number[],
  bossIds: number[],
  is_pvp: boolean,
  is_pvp_long: boolean
) => {
  const event = await prisma.raid.create({
    data: {
      type,
      dkp_summary,
      start_date,
      created_at: new Date(),
      is_pvp,
      is_pvp_long,
      attendance: {
        create: userIds.map((user_id) => ({
          user_id,
          created_at: new Date(),
        })),
      },
    },
  });

  await prisma.raidBoss.createMany({
    data: bossIds.map((boss_id) => ({
      raid_id: event.id,
      boss_id,
    })),
    skipDuplicates: true,
  });

  return event;
};

export default createRaidEvent;
