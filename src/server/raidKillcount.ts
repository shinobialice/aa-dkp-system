import "server-only";
import * as v from "valibot";
import sql from "@/shared/lib/db";
import type { RaidKillcountRow, UserRow } from "@/shared/lib/dbTypes";

export type RaidKillcountInsert = Omit<RaidKillcountRow, "id" | "raid_id">;

const COUNTER_SCHEMA = v.pipe(v.number(), v.integer(), v.minValue(0));

const KILLCOUNT_SCHEMA = v.array(
  v.object({
    userName: v.string(),
    playerClass: v.string(),
    startHonor: COUNTER_SCHEMA,
    endHonor: COUNTER_SCHEMA,
    startKills: COUNTER_SCHEMA,
    endKills: COUNTER_SCHEMA,
    comment: v.optional(v.string()),
  }),
);

export async function resolveRaidKillcount(
  killcount: unknown,
): Promise<RaidKillcountInsert[]> {
  const result = v.safeParse(KILLCOUNT_SCHEMA, killcount);
  if (!result.success) {
    throw new Error("Некорректный киллкаунт рейда");
  }
  if (result.output.length === 0) return [];

  const users = await sql<Pick<UserRow, "id" | "username">[]>`
    SELECT id, username FROM "user"
    WHERE username IN ${sql(result.output.map((row) => row.userName))}
  `;
  const idByName = new Map(users.map((user) => [user.username, user.id]));

  const rowsByUser = new Map<number, RaidKillcountInsert>();
  const unknownNames: string[] = [];
  for (const row of result.output) {
    const userId = idByName.get(row.userName);
    if (userId === undefined) {
      unknownNames.push(row.userName);
      continue;
    }
    rowsByUser.set(userId, {
      user_id: userId,
      class: row.playerClass,
      start_honor: row.startHonor,
      end_honor: row.endHonor,
      start_kills: row.startKills,
      end_kills: row.endKills,
      comment: row.comment || null,
    });
  }
  if (unknownNames.length > 0) {
    throw new Error(
      `В киллкаунте рейда ники, которых нет на сайте: ${unknownNames.join(", ")}`,
    );
  }
  return [...rowsByUser.values()];
}
