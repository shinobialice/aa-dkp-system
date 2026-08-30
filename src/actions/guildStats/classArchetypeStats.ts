"use server";

import sql from "@/shared/lib/db";
import { sortPlayers, type NamedPlayer } from "./playerRef";

export type ClassArchetypeStat = {
  className: string;
  count: number;
  percent: number;
  players: NamedPlayer[];
};

const UNSET_LABEL = "Не выбран";

// Распределение игровых классов (3 специализации -> имя, см. user_archetype)
// среди активных участников гильдии. Только мейн (role_slot = 1) — доп.
// роли (2/3) не должны раздувать статистику по классам.
export async function getClassArchetypeStats(): Promise<ClassArchetypeStat[]> {
  const rows = await sql<
    { class_name: string | null; username: string; class: string | null }[]
  >`
    SELECT ua.class_name, u.username, u.class
    FROM "user" u
    LEFT JOIN user_archetype ua ON ua.user_id = u.id AND ua.role_slot = 1
    WHERE u.active = true
  `.catch((error) => {
    console.error("Ошибка при получении статистики по классам:", error);
    throw new Error("Не удалось загрузить статистику по классам");
  });

  const counts = new Map<string, number>();
  const players = new Map<string, NamedPlayer[]>();
  for (const row of rows) {
    const name = row.class_name ?? UNSET_LABEL;
    counts.set(name, (counts.get(name) ?? 0) + 1);
    if (!players.has(name)) players.set(name, []);
    players.get(name)!.push({ username: row.username, class: row.class });
  }

  const total = rows.length;
  const unsetCount = counts.get(UNSET_LABEL) ?? 0;
  counts.delete(UNSET_LABEL);

  const result = [...counts.entries()]
    .map(([className, count]) => ({
      className,
      count,
      percent: total ? (count / total) * 100 : 0,
      players: sortPlayers(players.get(className) ?? []),
    }))
    .sort((a, b) => b.count - a.count || a.className.localeCompare(b.className, "ru"));

  if (unsetCount > 0) {
    result.push({
      className: UNSET_LABEL,
      count: unsetCount,
      percent: total ? (unsetCount / total) * 100 : 0,
      players: sortPlayers(players.get(UNSET_LABEL) ?? []),
    });
  }

  return result;
}
