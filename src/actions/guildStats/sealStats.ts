"use server";

import sql from "@/shared/lib/db";
import { SEAL_GRADES } from "@/widgets/profile/seals/sealsData";

export type SealGradeStat = {
  grade: number;
  label: string;
  count: number;
  userCount: number;
};

// Сколько печатей какой редкости у активных участников гильдии.
export async function getSealGradeStats(): Promise<SealGradeStat[]> {
  const rows = await sql<{ grade: number; user_id: number }[]>`
    SELECT us.grade, us.user_id
    FROM user_seals us
    JOIN "user" u ON u.id = us.user_id
    WHERE u.active = true
  `.catch((error) => {
    console.error("Ошибка при получении статистики по печатям:", error);
    throw new Error("Не удалось загрузить статистику по печатям");
  });

  return SEAL_GRADES.map(({ grade, label }) => {
    const matching = rows.filter((r) => r.grade === grade);
    return {
      grade,
      label,
      count: matching.length,
      userCount: new Set(matching.map((r) => r.user_id)).size,
    };
  })
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.grade - a.grade);
}
