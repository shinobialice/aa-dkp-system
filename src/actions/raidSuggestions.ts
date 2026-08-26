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
  bossName: BossName;
  killTime: string;
};

export async function getPendingRaidSuggestions(): Promise<RaidSuggestion[]> {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);

  const rows = await sql<{ boss_name: BossName; kill_time: string }[]>`
    SELECT boss_name, kill_time FROM boss_kill_raid_suggestions
    ORDER BY kill_time DESC
  `;
  return rows.map((r) => ({ bossName: r.boss_name, killTime: r.kill_time }));
}

// Вызывается из registerBossKill при каждой регистрации килла/времени —
// не через ensurePrivilieges (это внутренний вызов сервера), пишем прямым
// upsert-ом. Одна ожидающая подсказка на босса: если её ещё не обработали,
// а босса убили заново или поправили время — просто обновляем время.
export async function upsertRaidSuggestion(boss: BossName, killTimeIso: string) {
  await sql<any[]>`
    INSERT INTO boss_kill_raid_suggestions (boss_name, kill_time, created_at)
    VALUES (${boss}, ${killTimeIso}, now())
    ON CONFLICT (boss_name) DO UPDATE SET
      kill_time = EXCLUDED.kill_time,
      created_at = EXCLUDED.created_at
  `;
}

export async function approveRaidSuggestion(boss: BossName) {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);

  const [suggestion] = await sql<{ kill_time: string }[]>`
    SELECT kill_time FROM boss_kill_raid_suggestions WHERE boss_name = ${boss}
  `;
  if (!suggestion) {
    throw new Error("Подсказка уже обработана");
  }

  const bosses = await getBosses();
  const raidBoss = bosses.find(
    (b) => b.boss_name === RAID_BOSS_NAME_BY_TRACKER_NAME[boss],
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

  await sql<any[]>`DELETE FROM boss_kill_raid_suggestions WHERE boss_name = ${boss}`;

  revalidatePath("/activities");

  return raid;
}

export async function dismissRaidSuggestion(boss: BossName) {
  await ensurePrivilieges(SUGGESTION_MANAGER_TAGS);
  await sql<any[]>`DELETE FROM boss_kill_raid_suggestions WHERE boss_name = ${boss}`;
  revalidatePath("/activities");
}
