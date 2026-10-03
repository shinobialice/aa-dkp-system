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

// Только мейн-роль: доп. роли не должны раздувать статистику по классам.
export async function getClassArchetypeStats(): Promise<ClassArchetypeStat[]> {
  const rows = await sql<
    { class_name: string | null; username: string; class: string | null }[]
  >`
    SELECT ua.class_name, u.username, u.class
    FROM "user" u
    LEFT JOIN user_archetype ua ON ua.user_id = u.id AND ua.role_slot = 1
    WHERE u.active = true
      AND u.id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
  `.catch((error) => {
    console.error("Ошибка при получении статистики по классам:", error);
    throw new Error("Не удалось загрузить статистику по классам");
  });

  const playersByClass = new Map<string, NamedPlayer[]>();
  for (const row of rows) {
    const name = row.class_name ?? UNSET_LABEL;
    const list = playersByClass.get(name) ?? [];
    list.push({ username: row.username, class: row.class });
    playersByClass.set(name, list);
  }

  const toStat = (className: string, members: NamedPlayer[]) => ({
    className,
    count: members.length,
    percent: rows.length ? (members.length / rows.length) * 100 : 0,
    players: sortPlayers(members),
  });

  const unset = playersByClass.get(UNSET_LABEL);
  playersByClass.delete(UNSET_LABEL);

  const result = [...playersByClass]
    .map(([className, members]) => toStat(className, members))
    .sort(
      (a, b) =>
        b.count - a.count || a.className.localeCompare(b.className, "ru"),
    );
  if (unset) result.push(toStat(UNSET_LABEL, unset));

  return result;
}
