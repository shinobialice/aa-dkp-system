import { groupByClass } from "@/shared/config/classes";
import { formatMoscowHM, plural } from "@/shared/lib/format";
import { getMoscowISOString } from "@/utils/getMoscowISOString";
import type { IdFlags, PickerUser } from "../eventFormModel";
import { scanMinutes, shortStayIds, type RaidScan } from "../raidScanModel";

export type ParticipantFilter = "all" | "on" | "off";

export type ParticipantGroup = {
  cls: string | null;
  title: string;
  selected: number;
  total: number;
  people: PickerUser[];
};

export function countSelected(users: PickerUser[], selectedIds: IdFlags) {
  return users.filter((user) => selectedIds[user.id]).length;
}

export function countLate(
  users: PickerUser[],
  selectedIds: IdFlags,
  lateIds: IdFlags,
) {
  return users.filter((user) => selectedIds[user.id] && lateIds[user.id])
    .length;
}

export function participantGroups(
  users: PickerUser[],
  selectedIds: IdFlags,
  filter: ParticipantFilter,
  search: string,
): ParticipantGroup[] {
  const term = search.trim().toLowerCase();
  const isVisible = (user: PickerUser) => {
    if (term && !user.username.toLowerCase().includes(term)) return false;
    if (filter === "on") return !!selectedIds[user.id];
    if (filter === "off") return !selectedIds[user.id];
    return true;
  };

  return groupByClass(users, (user) => user.class)
    .map((group) => ({
      cls: group.cls,
      title: group.title,
      selected: countSelected(group.items, selectedIds),
      total: group.items.length,
      people: group.items
        .filter(isVisible)
        .sort((a, b) => joinedTime(a) - joinedTime(b)),
    }))
    .filter((group) => group.people.length > 0);
}

export function scanDay(date: Date | null) {
  return getMoscowISOString(date ?? new Date()).slice(0, 10);
}

export function scanSummary(scan: RaidScan) {
  const found = Object.keys(scan.members).length;
  const period = `${formatMoscowHM(scan.startedAt)}–${formatMoscowHM(scan.endedAt)}`;
  return {
    title: `Из сканера (${period}): ${found} ${plural(found, "участник", "участника", "участников")}`,
    unmatched: scan.unmatched.join(", "),
  };
}

export function lateSuggestion(scan: RaidScan, users: PickerUser[]) {
  const nameById = new Map(users.map((user) => [user.id, user.username]));
  const ids = shortStayIds(scan);
  const people = ids.flatMap((id) => {
    const name = nameById.get(id);
    return name
      ? [`${name} — ${Math.round(scan.members[id].minutes)} мин`]
      : [];
  });
  return {
    ids,
    text: `Меньше половины рейда (${Math.round(scanMinutes(scan))} мин) были: ${people.join(", ")}. Отметить опоздавшими?`,
  };
}

export function flagsForUsers(users: PickerUser[]): IdFlags {
  return Object.fromEntries(users.map((user) => [user.id, true]));
}

function joinedTime(user: PickerUser) {
  return user.joined_at ? new Date(user.joined_at).getTime() : Infinity;
}
