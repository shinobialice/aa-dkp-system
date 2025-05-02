// src/actions/getUserActivity.ts
"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserActivity(userId: number) {
  const attendances = await prisma.raidAttendance.findMany({
    where: { user_id: userId },
    include: {
      raid: true,
    },
  });

  const grouped: Record<string, { праймы: number; агл: number }> = {};

  attendances.forEach(({ raid }) => {
    if (!raid.start_date) return;

    const date = raid.start_date.toISOString().split("T")[0];
    const type = raid.type?.toLowerCase() === "прайм" ? "праймы" : "агл";

    if (!grouped[date]) {
      grouped[date] = { праймы: 0, агл: 0 };
    }
    grouped[date][type]++;
  });

  return Object.entries(grouped)
    .map(([date, data]) => ({
      date,
      ...data,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}
