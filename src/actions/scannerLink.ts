"use server";

import sql from "@/shared/lib/db";
import type { ScannerKeyRow, UserRow } from "@/shared/lib/dbTypes";
import {
  createScannerKey,
  SCANNER_CODE_PATTERN,
  SCANNER_USER_TAGS,
} from "@/server/scanner/auth";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";

const LINK_TTL_MINUTES = 10;
const SCANNER_ADMIN_TAGS = ["Администратор"];

export type ScannerKey = Pick<ScannerKeyRow, "id" | "label" | "last_used_at"> &
  Pick<UserRow, "username">;

export async function confirmScannerLink(code: string) {
  await ensurePrivilieges(SCANNER_USER_TAGS);
  const userId = await getSessionUserId();
  if (userId === null) throw new Error("Нужно войти на сайт");
  if (!SCANNER_CODE_PATTERN.test(code)) {
    throw new Error("Код подключения не распознан");
  }

  const [user] = await sql<Pick<UserRow, "username">[]>`
    SELECT username FROM "user" WHERE id = ${userId}
  `;
  const label = `Сканер · ${new Date().toLocaleDateString("ru-RU")}`;
  const key = await createScannerKey(userId, label);

  await sql`DELETE FROM scanner_link WHERE expires_at < now()`;
  await sql`
    INSERT INTO scanner_link (code, user_id, key, expires_at)
    VALUES (${code}, ${userId}, ${key}, now() + make_interval(mins => ${LINK_TTL_MINUTES}))
    ON CONFLICT (code) DO UPDATE
      SET user_id = EXCLUDED.user_id, key = EXCLUDED.key, expires_at = EXCLUDED.expires_at
  `;
  return { username: user.username };
}

export async function getScannerKeys(): Promise<ScannerKey[]> {
  await ensurePrivilieges(SCANNER_ADMIN_TAGS);
  return sql<ScannerKey[]>`
    SELECT k.id, k.label, k.last_used_at, u.username
    FROM scanner_key k
    JOIN "user" u ON u.id = k.user_id
    WHERE k.revoked_at IS NULL
    ORDER BY k.last_used_at DESC NULLS LAST, k.created_at DESC
  `;
}

export async function revokeScannerKey(keyId: number) {
  await ensurePrivilieges(SCANNER_ADMIN_TAGS);
  await sql`
    UPDATE scanner_key SET revoked_at = now()
    WHERE id = ${keyId} AND revoked_at IS NULL
  `;
}
