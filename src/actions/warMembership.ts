"use server";

import sql from "@/shared/lib/db";

export type PeriodMembershipEntry = {
  userId: number;
  username: string;
  avatarUrl: string | null;
  at: string;
};

export type PeriodAfkEntry = {
  userId: number;
  username: string;
  avatarUrl: string | null;
  from: string;
  to: string | null;
};

export type PeriodMembershipChanges = {
  joined: PeriodMembershipEntry[];
  left: PeriodMembershipEntry[];
  afk: PeriodAfkEntry[];
};

// Кто вступил и кто ушёл за период — не привязано к режиму (вар/фришка),
// состав меняется независимо от того, что сейчас идёт.
// "Вступил" — "user".joined_at; "Ушёл" — active стал false, inactive_since
// выставляется в этот момент (см. updateUser.ts). Тех, кто сейчас с тэгом АФК,
// в "Ушли" не показываем: админ просто не снял тэг при деактивации, реальное
// место такого игрока — список АФК. АФК — тэги user_tags, пересекающиеся с
// периодом: и ушедшие в АФК в этом периоде, и вернувшиеся из него.
export async function getPeriodMembershipChanges(
  startedAt: string,
  endedAt: string | null,
): Promise<PeriodMembershipChanges> {
  const rangeEnd = endedAt ?? new Date().toISOString();
  try {
    const [joined, left, afk] = await Promise.all([
      sql<PeriodMembershipEntry[]>`
        SELECT id AS "userId", username, avatar_url AS "avatarUrl", joined_at AS at
        FROM "user"
        WHERE joined_at >= ${startedAt} AND joined_at < ${rangeEnd}
        ORDER BY joined_at
      `,
      sql<PeriodMembershipEntry[]>`
        SELECT id AS "userId", username, avatar_url AS "avatarUrl", inactive_since AS at
        FROM "user" u
        WHERE active = false
          AND inactive_since >= ${startedAt} AND inactive_since < ${rangeEnd}
          AND NOT EXISTS (
            SELECT 1 FROM user_tags ut
            WHERE ut.user_id = u.id AND ut.tag = 'АФК' AND ut.removed_at IS NULL
          )
        ORDER BY inactive_since
      `,
      sql<PeriodAfkEntry[]>`
        SELECT ut.user_id AS "userId", u.username, u.avatar_url AS "avatarUrl",
          ut.created_at AS "from", ut.removed_at AS "to"
        FROM user_tags ut
        JOIN "user" u ON u.id = ut.user_id
        WHERE ut.tag = 'АФК'
          AND ut.created_at < ${rangeEnd}
          AND (ut.removed_at IS NULL OR ut.removed_at >= ${startedAt})
        ORDER BY ut.created_at
      `,
    ]);
    return { joined, left, afk };
  } catch (error) {
    console.error(
      "Ошибка при получении изменений состава гильдии за период:",
      error,
    );
    return { joined: [], left: [], afk: [] };
  }
}
