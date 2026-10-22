import "server-only";
import crypto from "crypto";
import sql from "@/shared/lib/db";
import type { ScannerKeyRow, UserRow } from "@/shared/lib/dbTypes";
import { hashToken } from "@/shared/lib/session";
import { KILLCOUNT_EDITOR_TAGS } from "@/server/killcountEditors";
import { RAID_EDITOR_TAGS } from "@/server/raidLinks";

export const SCANNER_USER_TAGS = [
  ...new Set([...KILLCOUNT_EDITOR_TAGS, ...RAID_EDITOR_TAGS]),
];

export const SCANNER_CODE_PATTERN = /^[0-9a-f]{32}$/;

export type ScannerUser = Pick<UserRow, "id" | "username"> & { keyId: number };

type KeyQueryRow = Pick<ScannerKeyRow, "id" | "user_id"> &
  Pick<UserRow, "username">;

export async function userHasScannerTags(userId: number) {
  const [row] = await sql<Pick<ScannerKeyRow, "id">[]>`
    SELECT id FROM user_tags
    WHERE user_id = ${userId} AND tag = ANY(${SCANNER_USER_TAGS}) AND removed_at IS NULL
    LIMIT 1
  `;
  return !!row;
}

export async function createScannerKey(userId: number, label: string) {
  const key = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO scanner_key (user_id, key_hash, label)
    VALUES (${userId}, ${hashToken(key)}, ${label})
  `;
  return key;
}

export async function getScannerUser(
  request: Request,
): Promise<ScannerUser | null> {
  const header = request.headers.get("authorization") ?? "";
  const key = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!key) return null;

  const [row] = await sql<KeyQueryRow[]>`
    SELECT k.id, k.user_id, u.username
    FROM scanner_key k
    JOIN "user" u ON u.id = k.user_id
    WHERE k.key_hash = ${hashToken(key)} AND k.revoked_at IS NULL AND u.active
  `;
  if (!row) return null;
  if (!(await userHasScannerTags(row.user_id))) return null;

  await sql`UPDATE scanner_key SET last_used_at = now() WHERE id = ${row.id}`;
  return { id: row.user_id, username: row.username, keyId: row.id };
}
