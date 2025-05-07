"use server";

import prisma from "@/lib/db";

export async function getUserMonthlyAttendance(
  userId: number,
  year: number,
  month: number
) {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 1);

  const allRaids = await prisma.raid.findMany({
    where: {
      start_date: {
        gte: startDate,
        lt: endDate,
      },
    },
    include: {
      raidBosses: {
        include: { boss: true },
      },
      attendance: true,
    },
  });

  let totalAgl = 0;
  let totalPrime = 0;
  let userAgl = 0;
  let userPrime = 0;

  allRaids.forEach((raid) => {
    const dkp = raid.raidBosses.reduce(
      (sum, rb) => sum + rb.boss.dkp_points,
      0
    );
    const attended = raid.attendance.some((a) => a.user_id === userId);

    if (raid.type === "Прайм") {
      totalPrime += dkp;
      if (attended) userPrime += dkp;
    } else if (raid.type === "АГЛ") {
      totalAgl += dkp;
      if (attended) userAgl += dkp;
    }
  });

  const totalDKP = totalAgl + totalPrime;
  const userDKP = userAgl + userPrime;

  return {
    aglPercent: totalAgl ? (userAgl / totalAgl) * 100 : 0,
    primePercent: totalPrime ? (userPrime / totalPrime) * 100 : 0,
    totalPercent: totalDKP ? (userDKP / totalDKP) * 100 : 0,
    dkp: userDKP,
  };
}
