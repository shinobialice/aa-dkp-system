import * as v from "valibot";
import type { Boss } from "@/actions/getBosses";
import type { RaidDetails } from "@/actions/getRaidById";
import { formatDuration, formatMoscowHM } from "@/shared/lib/format";
import type { EventDraft, IdFlags, PickerUser } from "./eventFormModel";

export const PVP_PRIME_BOSS = "ПВП прайм";

const HALF_HOUR_MINUTES = 30;
const MINUTE_MS = 60_000;
const MAX_DURATION_MINUTES = 24 * 60;

export type ScanMember = {
  minutes: number;
  joinedAt: Date;
};

export type RaidScan = {
  startedAt: Date;
  endedAt: Date;
  members: Record<number, ScanMember>;
  unmatched: string[];
};

const ISO_TIME = v.pipe(v.string(), v.isoTimestamp());

const SCAN_FILE_SCHEMA = v.object({
  format: v.literal("corvus-raid/1"),
  started_at: ISO_TIME,
  ended_at: ISO_TIME,
  members: v.array(
    v.object({
      name: v.string(),
      seconds: v.pipe(v.number(), v.minValue(0)),
      first_join_at: ISO_TIME,
    }),
  ),
});

export function parseRaidScan(text: string, users: PickerUser[]): RaidScan {
  const result = v.safeParse(SCAN_FILE_SCHEMA, parseJson(text));
  if (!result.success) {
    throw new Error("Это не файл рейда из сканера");
  }

  const idByName = new Map(
    users.map((user) => [user.username.toLowerCase(), user.id]),
  );
  const members: Record<number, ScanMember> = {};
  const unmatched: string[] = [];
  for (const member of result.output.members) {
    const userId = idByName.get(member.name.toLowerCase());
    if (userId === undefined) {
      unmatched.push(member.name);
      continue;
    }
    members[userId] = {
      minutes: member.seconds / 60,
      joinedAt: new Date(member.first_join_at),
    };
  }

  return {
    startedAt: new Date(result.output.started_at),
    endedAt: new Date(result.output.ended_at),
    members,
    unmatched,
  };
}

export function scanDraftPatch(
  scan: RaidScan,
  current: EventDraft,
): Partial<EventDraft> {
  return {
    scan,
    date: current.date ?? scan.startedAt,
    durationMinutes: Math.max(1, Math.round(scanMinutes(scan))),
    participantIds: scanParticipantIds(scan),
    lateIds: {},
  };
}

function scanParticipantIds(scan: RaidScan): IdFlags {
  return Object.fromEntries(
    Object.keys(scan.members).map((id) => [Number(id), true]),
  );
}

// Кандидаты в опоздавшие — кто пробыл в рейде меньше половины его времени:
// у часового АГЛ это пришедшие на последние полчаса. Решает секретарь.
export function shortStayIds(scan: RaidScan) {
  const half = scanMinutes(scan) / 2;
  return Object.entries(scan.members)
    .filter(([, member]) => member.minutes < half)
    .sort(([, a], [, b]) => a.minutes - b.minutes)
    .map(([id]) => Number(id));
}

export function scanMinutes(scan: RaidScan) {
  return (scan.endedAt.getTime() - scan.startedAt.getTime()) / MINUTE_MS;
}

export function isPvpPrime(bosses: Boss[]) {
  return bosses.some((boss) => boss.boss_name === PVP_PRIME_BOSS);
}

export function storedPersonalDkp(event: RaidDetails) {
  return Object.fromEntries(
    event.raid_attendance.flatMap((row) =>
      row.dkp === null ? [] : [[row.user.id, row.dkp]],
    ),
  );
}

// ПВП прайм: очки идут за каждые начатые полчаса — и за весь прайм, и
// каждому за его время в рейде. Кого отметили вручную, без данных сканера,
// получает очки за весь прайм.
export function primeHalfHours(durationMinutes: number | null) {
  return durationMinutes === null ? 0 : halfHoursOf(durationMinutes);
}

export function draftPersonalDkp(
  draft: EventDraft,
  userIds: number[],
  raidDkp: number,
): Record<number, number> {
  const raidHalfHours = primeHalfHours(draft.durationMinutes);
  if (!isPvpPrime(draft.bosses) || raidHalfHours === 0) return {};
  return Object.fromEntries(
    userIds.map((id) => {
      const member = draft.scan?.members[id];
      if (member) {
        const share = Math.min(halfHoursOf(member.minutes), raidHalfHours);
        return [id, Math.round((raidDkp * share) / raidHalfHours)];
      }
      return [id, Math.min(draft.storedDkp[id] ?? raidDkp, raidDkp)];
    }),
  );
}

export function participantNotes(
  scan: RaidScan | null,
  personalDkp: Record<number, number>,
): Record<number, string> {
  const ids = new Set([
    ...Object.keys(scan?.members ?? {}).map(Number),
    ...Object.keys(personalDkp).map(Number),
  ]);
  return Object.fromEntries(
    [...ids].map((id) => {
      const member = scan?.members[id];
      const parts = member
        ? [
            `с ${formatMoscowHM(member.joinedAt)}`,
            formatDuration(Math.max(1, Math.round(member.minutes))),
          ]
        : [];
      if (id in personalDkp) parts.push(`${personalDkp[id]} дкп`);
      return [id, parts.join(" · ")];
    }),
  );
}

export function splitDuration(durationMinutes: number | null) {
  if (durationMinutes === null) return { hours: "", minutes: "" };
  return {
    hours: String(Math.floor(durationMinutes / 60)),
    minutes: String(durationMinutes % 60),
  };
}

export function joinDuration(hours: string, minutes: string) {
  const total = (Number(hours) || 0) * 60 + (Number(minutes) || 0);
  if (total <= 0) return null;
  return Math.min(Math.round(total), MAX_DURATION_MINUTES);
}

function halfHoursOf(minutes: number) {
  return Math.max(1, Math.ceil(minutes / HALF_HOUR_MINUTES));
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Файл не читается: это не JSON");
  }
}
