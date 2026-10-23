import "server-only";
import sql from "@/shared/lib/db";
import { getMoscowISOString } from "@/utils/getMoscowISOString";
import {
  covers,
  linkRaid,
  raidSelect,
  raidsOfDay,
  recordFighters,
  toWindow,
} from "./shared";
import type {
  AglItem,
  AglRecordSummary,
  KillcountEntry,
  RaidQueryRow,
  RecordQueryRow,
} from "./types";

const AGL_HISTORY_DAYS = 45;
const DAY_MS = 86_400_000;

export function getAglHistory() {
  return aglItemsSince(
    getMoscowISOString(new Date(Date.now() - AGL_HISTORY_DAYS * DAY_MS)),
  );
}

export async function getAglToday(day: string) {
  const items = await aglItemsSince(`${day}T00:00:00`);
  return items.filter((item) => item.day === day);
}

export async function getSelectedAglRecord(
  items: AglItem[],
  wanted: string | undefined,
) {
  const scanned = items.filter((item) => item.record);
  const item = scanned.find((entry) => entry.key === wanted) ?? scanned[0];
  return item?.record ? getAglRecord(item.record.id) : null;
}

async function aglItemsSince(since: string): Promise<AglItem[]> {
  const [records, raids] = await Promise.all([
    sql<RecordQueryRow[]>`
      SELECT sr.id, sr.kind, sr.started_at, sr.ended_at, sr.raid, sr.killcount, u.username
      FROM scanner_record sr
      JOIN "user" u ON u.id = sr.user_id
      WHERE sr.kind = 'agl' AND sr.status = 'published' AND sr.started_at >= ${since}
      ORDER BY sr.started_at DESC
    `,
    sql<RaidQueryRow[]>`
      ${raidSelect("АГЛ")} AND r.start_date >= ${since}
      ORDER BY r.start_date DESC
    `,
  ]);

  const items: AglItem[] = [];
  const usedRecords = new Set<number>();
  for (const raid of raids) {
    const record = records.find(
      (candidate) =>
        !usedRecords.has(candidate.id) &&
        covers(
          toWindow(
            candidate.started_at,
            candidate.ended_at,
            candidate.username,
          ),
          raid.startDate,
        ),
    );
    if (record) usedRecords.add(record.id);
    items.push({
      key: record ? String(record.id) : `raid-${raid.id}`,
      day: raid.startDate.slice(0, 10),
      time: raid.time,
      boss: raid.boss,
      people: raid.people,
      record: record ? await aglSummary(record) : null,
    });
  }
  for (const record of records) {
    if (usedRecords.has(record.id)) continue;
    items.push({
      key: String(record.id),
      day: record.started_at.slice(0, 10),
      time: record.started_at.slice(11, 16),
      boss: "АГЛ",
      people: 0,
      record: await aglSummary(record),
    });
  }
  return items.sort((a, b) =>
    `${b.day} ${b.time}`.localeCompare(`${a.day} ${a.time}`),
  );
}

export async function getAglRecord(
  recordId: number,
): Promise<KillcountEntry | null> {
  const [record] = await sql<RecordQueryRow[]>`
    SELECT sr.id, sr.kind, sr.started_at, sr.ended_at, sr.raid, sr.killcount, u.username
    FROM scanner_record sr
    JOIN "user" u ON u.id = sr.user_id
    WHERE sr.id = ${recordId} AND sr.kind = 'agl' AND sr.status = 'published'
  `;
  if (!record) return null;
  const window = toWindow(record.started_at, record.ended_at, record.username);
  const day = record.started_at.slice(0, 10);
  const raids = await raidsOfDay("АГЛ", day);
  return {
    kind: "agl",
    key: String(record.id),
    day,
    window,
    fighters: await recordFighters(record),
    raids: raids
      .map((raid) => linkRaid(raid, window))
      .filter((raid) => raid.isLinked),
    canEditRows: false,
  };
}

async function aglSummary(record: RecordQueryRow): Promise<AglRecordSummary> {
  const fighters = await recordFighters(record);
  return {
    id: record.id,
    totalKills: fighters.reduce(
      (sum, row) => sum + row.endKills - row.startKills,
      0,
    ),
    fighters: fighters.length,
    window: {
      startedAt: record.started_at,
      endedAt: record.ended_at,
      scannedBy: record.username,
    },
  };
}
