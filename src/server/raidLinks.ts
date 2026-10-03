import "server-only";
import type { TransactionSql } from "postgres";

export const RAID_EDITOR_TAGS = [
  "Администратор",
  "Raid Manager",
  "Модератор",
  "Секретутка",
];

export type RaidLinks = {
  userIds: number[];
  lateUserIds: number[];
  bossIds: number[];
  bonusTypeIds: number[];
};

export async function insertRaidLinks(
  tx: TransactionSql,
  raidId: number,
  { userIds, lateUserIds, bossIds, bonusTypeIds }: RaidLinks,
) {
  if (userIds.length > 0) {
    const createdAt = new Date().toISOString();
    const attendance = userIds.map((user_id) => ({
      raid_id: raidId,
      user_id,
      created_at: createdAt,
      is_late: lateUserIds.includes(user_id),
    }));
    await tx`INSERT INTO raid_attendance ${tx(attendance)}`;
  }

  if (bossIds.length > 0) {
    const bosses = bossIds.map((boss_id) => ({ raid_id: raidId, boss_id }));
    await tx`INSERT INTO raid_boss ${tx(bosses)}`;
  }

  if (bonusTypeIds.length > 0) {
    const bonuses = bonusTypeIds.map((bonus_type_id) => ({
      raid_id: raidId,
      bonus_type_id,
    }));
    await tx`INSERT INTO raid_bonus ${tx(bonuses)}`;
  }
}

export async function deleteRaidLinks(tx: TransactionSql, raidId: number) {
  await tx`DELETE FROM raid_attendance WHERE raid_id = ${raidId}`;
  await tx`DELETE FROM raid_boss WHERE raid_id = ${raidId}`;
  await tx`DELETE FROM raid_bonus WHERE raid_id = ${raidId}`;
}
