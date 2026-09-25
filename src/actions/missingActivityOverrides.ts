"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

const MISSING_ACTIVITY_MANAGER_TAGS = [
  "Администратор",
  "Raid Manager",
  "Модератор",
  "Секретутка",
];

// Скрывает конкретный вычисленный пропуск (дата+время+босс) из карточки
// "Не заполнены" на activities — навсегда, независимо от месяца, в котором
// её открыли.
export async function dismissMissingSlot(
  date: string,
  time: string,
  bossName: string,
) {
  await ensurePrivilieges(MISSING_ACTIVITY_MANAGER_TAGS);

  await sql<any[]>`
    INSERT INTO missing_activity_overrides (activity_date, time, boss_name, kind)
    VALUES (${date}, ${time}, ${bossName}, 'dismiss')
    ON CONFLICT (activity_date, time, boss_name, kind) DO NOTHING
  `;
  revalidatePath("/activities");
}

// Добавляет свой пункт в список "Не заполнены" за конкретную дату.
export async function addManualMissingSlot(
  date: string,
  time: string,
  bossName: string,
) {
  await ensurePrivilieges(MISSING_ACTIVITY_MANAGER_TAGS);

  const trimmedBoss = bossName.trim();
  if (!trimmedBoss) {
    throw new Error("Укажите босса");
  }

  await sql<any[]>`
    INSERT INTO missing_activity_overrides (activity_date, time, boss_name, kind)
    VALUES (${date}, ${time}, ${trimmedBoss}, 'manual')
    ON CONFLICT (activity_date, time, boss_name, kind) DO NOTHING
  `;
  revalidatePath("/activities");
}

// Убирает вручную добавленный пункт (не вычисленный — для тех dismissMissingSlot).
export async function removeManualMissingSlot(id: number) {
  await ensurePrivilieges(MISSING_ACTIVITY_MANAGER_TAGS);

  await sql<any[]>`
    DELETE FROM missing_activity_overrides WHERE id = ${id} AND kind = 'manual'
  `;
  revalidatePath("/activities");
}
