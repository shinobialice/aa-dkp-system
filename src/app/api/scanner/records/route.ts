import { NextResponse } from "next/server";
import * as v from "valibot";
import sql from "@/shared/lib/db";
import type { ScannerRecordRow } from "@/shared/lib/dbTypes";
import { getScannerUser } from "@/server/scanner/auth";
import { moscowNaive, SCANNER_RECORD_SCHEMA } from "@/server/scanner/record";

type InsertedRow = Pick<ScannerRecordRow, "id" | "status">;

// Сканер присылает запись рейда после «Закончить рейд». Повтор с тем же
// client_id (отправка не дошла, сканер пробует снова) ничего не дублирует.
export async function POST(request: Request) {
  const user = await getScannerUser(request);
  if (!user) {
    return NextResponse.json({ error: "Invalid key" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body is not JSON" }, { status: 400 });
  }

  const parsed = v.safeParse(SCANNER_RECORD_SCHEMA, body);
  if (!parsed.success) {
    const issue = parsed.issues[0];
    const path = v.getDotPath(issue) ?? "";
    return NextResponse.json(
      { error: `Некорректная запись: ${path} ${issue.message}`.trim() },
      { status: 400 },
    );
  }
  const record = parsed.output;

  const [inserted] = await sql<InsertedRow[]>`
    INSERT INTO scanner_record (client_id, user_id, kind, started_at, ended_at, raid, killcount)
    VALUES (
      ${record.client_id},
      ${user.id},
      ${record.kind},
      ${moscowNaive(record.started_at)},
      ${moscowNaive(record.ended_at)},
      ${record.raid === null ? null : sql.json(record.raid)},
      ${record.killcount === null ? null : sql.json(record.killcount)}
    )
    ON CONFLICT (client_id) DO NOTHING
    RETURNING id, status
  `;
  if (inserted) {
    return NextResponse.json({ id: inserted.id, status: inserted.status });
  }

  const [existing] = await sql<InsertedRow[]>`
    SELECT id, status FROM scanner_record WHERE client_id = ${record.client_id}
  `;
  return NextResponse.json({
    id: existing.id,
    status: existing.status,
    duplicate: true,
  });
}
