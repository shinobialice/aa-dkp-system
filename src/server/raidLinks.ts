import "server-only";
import type { TransactionSql } from "postgres";
import * as v from "valibot";

export const RAID_EDITOR_TAGS = [
  "Администратор",
  "Raid Manager",
  "Модератор",
  "Секретутка",
];

export type PersonalDkp = Record<number, number>;

export type RaidLinks = {
  userIds: number[];
  lateUserIds: number[];
  personalDkp: PersonalDkp;
  bossIds: number[];
  bonusTypeIds: number[];
};

const MAX_DURATION_MINUTES = 24 * 60;

const DURATION_SCHEMA = v.nullable(
  v.pipe(
    v.number(),
    v.integer(),
    v.minValue(1),
    v.maxValue(MAX_DURATION_MINUTES),
  ),
);

const PERSONAL_DKP_SCHEMA = v.record(
  v.pipe(v.string(), v.regex(/^\d+$/)),
  v.pipe(v.number(), v.integer(), v.minValue(0)),
);

export function checkPersonalDkp(
  personalDkp: unknown,
  userIds: number[],
  raidDkp: number,
): PersonalDkp {
  const result = v.safeParse(PERSONAL_DKP_SCHEMA, personalDkp);
  const isValid =
    result.success &&
    Object.entries(result.output).every(
      ([userId, dkp]) => userIds.includes(Number(userId)) && dkp <= raidDkp,
    );
  if (!result.success || !isValid) {
    throw new Error("Некорректные личные очки участников");
  }
  return result.output;
}

export function checkDurationMinutes(durationMinutes: unknown) {
  const result = v.safeParse(DURATION_SCHEMA, durationMinutes);
  if (!result.success) {
    throw new Error("Некорректная длительность рейда");
  }
  return result.output;
}

export async function insertRaidLinks(
  tx: TransactionSql,
  raidId: number,
  { userIds, lateUserIds, personalDkp, bossIds, bonusTypeIds }: RaidLinks,
) {
  if (userIds.length > 0) {
    const createdAt = new Date().toISOString();
    const attendance = userIds.map((user_id) => ({
      raid_id: raidId,
      user_id,
      created_at: createdAt,
      is_late: lateUserIds.includes(user_id),
      dkp: personalDkp[user_id] ?? null,
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
