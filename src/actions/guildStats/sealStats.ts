"use server";

import sql from "@/shared/lib/db";
import { SEAL_GRADES } from "@/widgets/profile/seals/sealsData";
import { sortPlayers, type NamedPlayer } from "./playerRef";

export type SealGradeStat = {
  grade: number;
  label: string;
  count: number;
  userCount: number;
  players: NamedPlayer[];
};

// Сколько печатей какой редкости у активных участников гильдии.
export async function getSealGradeStats(): Promise<SealGradeStat[]> {
  const rows = await sql<
    { grade: number; user_id: number; username: string; class: string | null }[]
  >`
    SELECT us.grade, us.user_id, u.username, u.class
    FROM user_seals us
    JOIN "user" u ON u.id = us.user_id
    WHERE u.active = true
  `.catch((error) => {
    console.error("Ошибка при получении статистики по печатям:", error);
    throw new Error("Не удалось загрузить статистику по печатям");
  });

  return SEAL_GRADES.map(({ grade, label }) => {
    const matching = rows.filter((r) => r.grade === grade);

    const perUser = new Map<string, { class: string | null; count: number }>();
    for (const r of matching) {
      const existing = perUser.get(r.username);
      perUser.set(r.username, {
        class: r.class,
        count: (existing?.count ?? 0) + 1,
      });
    }
    const players: NamedPlayer[] = sortPlayers(
      [...perUser.entries()].map(([username, { class: cls, count }]) => ({
        username,
        class: cls,
        suffix: count > 1 ? `×${count}` : undefined,
      })),
    );

    return {
      grade,
      label,
      count: matching.length,
      userCount: perUser.size,
      players,
    };
  })
    .filter((stat) => stat.count > 0)
    .sort((a, b) => b.grade - a.grade);
}
