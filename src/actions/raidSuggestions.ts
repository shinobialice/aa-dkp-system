"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import createRaidEvent from "./createRaidEvent";
import { getBosses } from "./getBosses";
import { revalidatePath } from "next/cache";
import type { BossName } from "@/shared/config/bossRespawn";

const SUGGESTION_MANAGER_TAGS = ["Администратор", "Секретутка"];

// Марли и Морф в трекере респавна — те же боссы, что в рейдах категории
// "АГЛ", только под именем боевого проца ("Марли Прок"), не "Марли".
const RAID_BOSS_NAME_BY_TRACKER_NAME: Record<BossName, string> = {
  Марли: "Марли Прок",
  Морф: "Морф",
};

export type RaidSuggestion = {
  id: number;
  bossName: BossName;
  killTime: string;
};

export async function getPendingRaidSuggestions(): Promise<RaidSuggestion[]> {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);

  const rows = await sql<{ id: number; boss_name: BossName; kill_time: string }[]>`
    SELECT id, boss_name, kill_time FROM boss_kill_raid_suggestions
    WHERE status = 'pending'
    ORDER BY kill_time DESC
  `;
  return rows.map((r) => ({ id: r.id, bossName: r.boss_name, killTime: r.kill_time }));
}

// Вызывается из registerBossKill при каждой регистрации килла/времени — не
// через ensurePrivilieges (это внутренний вызов сервера). Раньше была одна
// строка на босса (ON CONFLICT по boss_name, перезапись времени), но у
// Морфа (и Марли) в сутки бывает 2 килла в разное время (12ч респаун) —
// перезапись стирала более раннюю ещё не обработанную подсказку насовсем.
// Теперь каждая регистрация — своя строка; от дублей на один и тот же килл
// защищает кулдаун в register_boss_kill (без успешной регистрации там эта
// функция вообще не вызывается).
export async function upsertRaidSuggestion(boss: BossName, killTimeIso: string) {
  await sql<any[]>`
    INSERT INTO boss_kill_raid_suggestions (boss_name, kill_time, created_at, status)
    VALUES (${boss}, ${killTimeIso}, now(), 'pending')
  `;
}

export async function approveRaidSuggestion(id: number) {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);

  const [suggestion] = await sql<{ boss_name: BossName; kill_time: string }[]>`
    SELECT boss_name, kill_time FROM boss_kill_raid_suggestions
    WHERE id = ${id} AND status = 'pending'
  `;
  if (!suggestion) {
    throw new Error("Подсказка уже обработана");
  }

  const bosses = await getBosses();
  const raidBoss = bosses.find(
    (b) => b.boss_name === RAID_BOSS_NAME_BY_TRACKER_NAME[suggestion.boss_name],
  );
  if (!raidBoss) {
    throw new Error("Не удалось найти босса рейда — заведите его на /settings");
  }

  const raid = await createRaidEvent(
    "АГЛ",
    raidBoss.dkp_points ?? 0,
    new Date(suggestion.kill_time),
    [],
    [raidBoss.id],
    false,
    false,
    false,
    false,
    [],
  );

  await sql<any[]>`DELETE FROM boss_kill_raid_suggestions WHERE id = ${id}`;

  revalidatePath("/activities");

  return raid;
}

export async function dismissRaidSuggestion(id: number) {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);
  // Не удаляем — помечаем отклонённой. "Обязательные посещения" смотрят и на
  // отклонённые подсказки: раз этот конкретный килл сознательно решили не
  // оформлять рейдом, не подсвечиваем его как пропуск в требуемом графике.
  await sql<any[]>`
    UPDATE boss_kill_raid_suggestions SET status = 'dismissed' WHERE id = ${id}
  `;
  revalidatePath("/activities");
}
