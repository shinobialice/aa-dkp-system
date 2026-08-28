"use server";

import sql from "@/shared/lib/db";

export type ClassArchetypeStat = {
  className: string;
  count: number;
  percent: number;
};

const UNSET_LABEL = "Не выбран";

// Распределение игровых классов (3 специализации -> имя, см. user_archetype)
// среди активных участников гильдии.
export async function getClassArchetypeStats(): Promise<ClassArchetypeStat[]> {
  const rows = await sql<{ class_name: string | null }[]>`
    SELECT ua.class_name
    FROM "user" u
    LEFT JOIN user_archetype ua ON ua.user_id = u.id
    WHERE u.active = true
  `.catch((error) => {
    console.error("Ошибка при получении статистики по классам:", error);
    throw new Error("Не удалось загрузить статистику по классам");
  });

  const counts = new Map<string, number>();
  for (const row of rows) {
    const name = row.class_name ?? UNSET_LABEL;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }

  const total = rows.length;
  const unsetCount = counts.get(UNSET_LABEL) ?? 0;
  counts.delete(UNSET_LABEL);

  const result = [...counts.entries()]
    .map(([className, count]) => ({
      className,
      count,
      percent: total ? (count / total) * 100 : 0,
    }))
    .sort((a, b) => b.count - a.count || a.className.localeCompare(b.className, "ru"));

  if (unsetCount > 0) {
    result.push({
      className: UNSET_LABEL,
      count: unsetCount,
      percent: total ? (unsetCount / total) * 100 : 0,
    });
  }

  return result;
}
