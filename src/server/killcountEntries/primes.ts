import "server-only";
import sql from "@/shared/lib/db";
import { parseKillcountDoc } from "@/server/scanner/record";
import { linkRaid, raidsOfDay, startTimes, toWindow } from "./shared";
import type { ArenaKillcount, PrimeDay, RecordQueryRow } from "./types";

type PrimeDayQueryRow = {
  day: string;
  totalKills: number;
  fighters: number;
  topUserName: string | null;
  topKills: number | null;
  startedAt: string | null;
  endedAt: string | null;
  scannedBy: string | null;
};

type FighterQueryRow = {
  id: number;
  userId: number;
  userName: string;
  role: string | null;
  avatarUrl: string | null;
  playerClass: string;
  startHonor: number;
  endHonor: number;
  startKills: number;
  endKills: number;
  comment: string | null;
};

export async function getPrimeDays(): Promise<PrimeDay[]> {
  const rows = await sql<PrimeDayQueryRow[]>`
    WITH days AS (
      SELECT
        s.recorded_at::date::text AS day,
        SUM(s.end_kills - s.start_kills)::int AS "totalKills",
        COUNT(DISTINCT s.user_id)::int AS fighters,
        MIN(s.scanner_record_id) AS record_id
      FROM killcount_stats s
      GROUP BY 1
    )
    SELECT
      d.day, d."totalKills", d.fighters,
      top.username AS "topUserName", top.kills AS "topKills",
      sr.started_at AS "startedAt", sr.ended_at AS "endedAt", su.username AS "scannedBy"
    FROM days d
    LEFT JOIN LATERAL (
      SELECT u.username, (s.end_kills - s.start_kills) AS kills
      FROM killcount_stats s
      JOIN "user" u ON u.id = s.user_id
      WHERE s.recorded_at::date::text = d.day
      ORDER BY kills DESC, (s.end_honor - s.start_honor) DESC
      LIMIT 1
    ) top ON true
    LEFT JOIN scanner_record sr ON sr.id = d.record_id
    LEFT JOIN "user" su ON su.id = sr.user_id
    ORDER BY d.day DESC
  `;
  return rows.map((row) => ({
    day: row.day,
    totalKills: row.totalKills,
    fighters: row.fighters,
    topUserName: row.topUserName,
    topKills: row.topKills,
    window: toWindow(row.startedAt, row.endedAt, row.scannedBy),
  }));
}

export async function getPrimeDay(day: string): Promise<ArenaKillcount> {
  const [rows, [record]] = await Promise.all([
    sql<FighterQueryRow[]>`
      SELECT
        s.id, u.id AS "userId", u.username AS "userName", u.class AS role,
        u.avatar_url AS "avatarUrl", s.class AS "playerClass",
        s.start_honor AS "startHonor", s.end_honor AS "endHonor",
        s.start_kills AS "startKills", s.end_kills AS "endKills", s.comment
      FROM killcount_stats s
      JOIN "user" u ON u.id = s.user_id
      WHERE s.recorded_at::date = ${day}::date
      ORDER BY (s.end_kills - s.start_kills) DESC, (s.end_honor - s.start_honor) DESC
    `,
    sql<RecordQueryRow[]>`
      SELECT sr.id, sr.kind, sr.started_at, sr.ended_at, sr.raid, sr.killcount, u.username
      FROM scanner_record sr
      JOIN "user" u ON u.id = sr.user_id
      WHERE sr.id = (
        SELECT MIN(scanner_record_id) FROM killcount_stats WHERE recorded_at::date = ${day}::date
      )
    `,
  ]);
  const window = record
    ? toWindow(record.started_at, record.ended_at, record.username)
    : null;
  const startAtByName = record
    ? startTimes(parseKillcountDoc(record.killcount).rows)
    : new Map<string, string>();
  const raids = await raidsOfDay("Прайм", day);

  return {
    kind: "prime",
    key: day,
    day,
    window,
    fighters: rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      userName: row.userName,
      role: row.role,
      avatarUrl: row.avatarUrl,
      playerClass: row.playerClass,
      startHonor: row.startHonor,
      endHonor: row.endHonor,
      startKills: row.startKills,
      endKills: row.endKills,
      comment: row.comment ?? undefined,
      startAt: startAtByName.get(row.userName) ?? null,
    })),
    raids: raids.map((raid) => linkRaid(raid, window)),
    canEditRows: true,
  };
}
