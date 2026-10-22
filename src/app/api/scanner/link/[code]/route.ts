import { NextResponse } from "next/server";
import sql from "@/shared/lib/db";
import type { ScannerLinkRow, UserRow } from "@/shared/lib/dbTypes";
import { SCANNER_CODE_PATTERN } from "@/server/scanner/auth";

type LinkQueryRow = Pick<ScannerLinkRow, "key"> & Pick<UserRow, "username">;

// Сканер опрашивает этот адрес, пока пользователь подтверждает подключение
// в браузере. Ключ отдаётся один раз: после ответа строка удаляется.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  if (!SCANNER_CODE_PATTERN.test(code)) {
    return NextResponse.json({ error: "Bad code" }, { status: 400 });
  }

  const [link] = await sql<LinkQueryRow[]>`
    DELETE FROM scanner_link l
    USING "user" u
    WHERE l.code = ${code} AND u.id = l.user_id AND l.expires_at > now()
    RETURNING l.key, u.username
  `;
  if (!link) {
    return NextResponse.json({ error: "Not confirmed yet" }, { status: 404 });
  }

  return NextResponse.json({ key: link.key, username: link.username });
}
