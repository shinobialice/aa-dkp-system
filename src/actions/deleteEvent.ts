"use server";

import { prisma } from "@/lib/db";

export default async function deleteEvent(eventId: number) {
  await prisma.raidAttendance.deleteMany({ where: { raid_id: eventId } });
  await prisma.raidBoss.deleteMany({ where: { raid_id: eventId } });
  await prisma.raid.delete({ where: { id: eventId } });
}
