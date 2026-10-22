"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "@/actions/ensurePrivilieges";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { RAID_EDITOR_TAGS } from "@/server/raidLinks";
import { filterScannerRows } from "@/server/killcountScanner";
import { type KillCount } from "../types";

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

export const prepareScannerKillCount = async (rows: KillCount[]) => {
  await ensurePrivilieges(KILLCOUNT_EDITOR_TAGS);
  return filterScannerRows(rows);
};

export const prepareRaidKillCount = async (rows: KillCount[]) => {
  await ensurePrivilieges(RAID_EDITOR_TAGS);
  return filterScannerRows(rows);
};
