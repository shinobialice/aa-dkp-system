"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import {
  KILLCOUNT_ROLES,
  resolveKillcountRole,
} from "@/shared/config/killcountRoles";
import { type KillCount, type KillCountExclusion } from "../types";

// Ники из черновика, которых нет среди пользователей сайта: сохранение
// с ними упадёт целиком, поэтому черновик показывает их заранее.
export const findUnknownKillCountUsers = async (userNames: string[]) => {
  await ensurePrivilieges(KILLCOUNT_EDITOR_TAGS);
  if (userNames.length === 0) return [];
  try {
    const users = await sql<{ username: string }[]>`
      SELECT username FROM "user" WHERE username IN ${sql(userNames)}
    `;
    const known = new Set(users.map((user) => user.username));
    return userNames.filter((name) => !known.has(name));
  } catch (error) {
    throw new Error("Не удалось проверить ники", { cause: error });
  }
};

// Черновик из сканера: оставляет только пользователей сайта на ДД-роли.
// Роль определяется по трём веткам из сканера (слот архетипа), иначе основная.
export const prepareScannerKillCount = async (
  rows: KillCount[],
): Promise<{ rows: KillCount[]; excluded: KillCountExclusion[] }> => {
  await ensurePrivilieges(KILLCOUNT_EDITOR_TAGS);
  if (rows.length === 0) return { rows: [], excluded: [] };
  try {
    const users = await sql<
      {
        id: number;
        username: string;
        class: string | null;
        secondary_class: string | null;
        tertiary_class: string | null;
      }[]
    >`
      SELECT id, username, class, secondary_class, tertiary_class
      FROM "user"
      WHERE username IN ${sql(rows.flatMap((row) => [row.userName, ...(row.aliases ?? [])]))}
    `;
    const archetypes = users.length
      ? await sql<
          {
            user_id: number;
            role_slot: number;
            specialization_1: string | null;
            specialization_2: string | null;
            specialization_3: string | null;
          }[]
        >`
          SELECT user_id, role_slot, specialization_1, specialization_2, specialization_3
          FROM user_archetype
          WHERE user_id IN ${sql(users.map((user) => user.id))}
        `
      : [];
    const userByName = new Map(users.map((user) => [user.username, user]));

    const kept: KillCount[] = [];
    const excluded: KillCountExclusion[] = [];
    for (const row of rows) {
      // Сменил ник на прайме: на сайте может быть ещё прежний.
      const user = [row.userName, ...(row.aliases ?? [])]
        .map((name) => userByName.get(name))
        .find(Boolean);
      if (!user) {
        excluded.push({ userName: row.userName, reason: "нет на сайте" });
        continue;
      }
      const { role } = resolveKillcountRole(
        user,
        archetypes.filter((slot) => slot.user_id === user.id),
        row.specs,
      );
      if (!role || !KILLCOUNT_ROLES.includes(role)) {
        excluded.push({
          userName: row.userName,
          reason: role ? `роль ${role}` : "роль не указана на сайте",
        });
        continue;
      }
      kept.push(
        user.username === row.userName
          ? { ...row, role }
          : {
              ...row,
              role,
              userName: user.username,
              comment: [row.comment, `ник в игре: ${row.userName}`]
                .filter(Boolean)
                .join("; "),
            },
      );
    }
    return { rows: kept, excluded };
  } catch (error) {
    throw new Error("Не удалось проверить список из сканера", { cause: error });
  }
};
