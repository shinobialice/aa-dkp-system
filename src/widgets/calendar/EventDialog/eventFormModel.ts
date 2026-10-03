import type { ActiveUser } from "@/actions/getActiveUsers";
import type { Boss } from "@/actions/getBosses";
import type { RaidDetails } from "@/actions/getRaidById";
import { plural } from "@/shared/lib/format";
import type { ResolvedAttendanceBonus } from "@/utils/attendanceBonusDefaults";
import computeRaidDkp from "@/utils/eventDkpCalculator";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

export type EventFormMode = "create" | "edit";

export type IdFlags = Record<number, boolean>;

export type EventDraft = {
  category: string | null;
  bosses: Boss[];
  date: Date | null;
  bonusIds: IdFlags;
  participantIds: IdFlags;
  lateIds: IdFlags;
  lootLinkIds: IdFlags;
};

export type EventFormErrors = {
  category: boolean;
  selectedBoss: boolean;
  selectedDate: boolean;
};

export type PickerUser = {
  id: number;
  username: string;
  class: string | null;
  joined_at?: string | null;
  inactive?: boolean;
};

export const NO_ERRORS: EventFormErrors = {
  category: false,
  selectedBoss: false,
  selectedDate: false,
};

export function initialDraft(event: RaidDetails | null): EventDraft {
  if (!event) {
    return {
      category: null,
      bosses: [],
      date: null,
      bonusIds: {},
      participantIds: {},
      lateIds: {},
      lootLinkIds: {},
    };
  }

  const attendance = event.raid_attendance;
  return {
    category: event.type,
    bosses: event.raid_boss.map((row) => row.boss),
    date: event.start_date ? parseMoscowISOString(event.start_date) : null,
    bonusIds: toFlags(event.bonusTypeIds),
    participantIds: toFlags(attendance.map((row) => row.user.id)),
    lateIds: toFlags(
      attendance.filter((row) => row.is_late).map((row) => row.user.id),
    ),
    lootLinkIds: {},
  };
}

export function validateDraft(draft: EventDraft): EventFormErrors {
  return {
    category: !draft.category,
    selectedBoss: draft.bosses.length === 0,
    selectedDate: !draft.date,
  };
}

export function hasErrors(errors: EventFormErrors) {
  return Object.values(errors).some(Boolean);
}

export function checkedIds(flags: IdFlags) {
  return Object.entries(flags)
    .filter(([, checked]) => checked)
    .map(([id]) => Number(id));
}

export function pickerUsers(
  activeUsers: ActiveUser[],
  event: RaidDetails | null,
): PickerUser[] {
  if (!event || activeUsers.length === 0) return activeUsers;

  const known = new Set(activeUsers.map((user) => user.id));
  const inactiveAttendees = event.raid_attendance
    .map((row) => row.user)
    .filter((user) => !known.has(user.id))
    .map((user) => ({
      id: user.id,
      username: user.username,
      class: user.class,
      joined_at: user.joined_at,
      inactive: true,
    }));
  return [...activeUsers, ...inactiveAttendees];
}

export function bonusesForBosses(
  bonuses: ResolvedAttendanceBonus[],
  bosses: Boss[],
) {
  return bonuses.filter((bonus) =>
    bosses.some((boss) => bonus.bossIds.includes(boss.id)),
  );
}

// Пока бонусы не загружены, отмеченные id не трогаем: иначе при открытии
// старого рейда на редактирование сохранённый исторический бонус тихо
// обнулился бы ещё до того, как админ вообще коснулся формы.
export function activeBonusIds(
  bonusIds: IdFlags,
  bonuses: ResolvedAttendanceBonus[] | undefined,
  bosses: Boss[],
) {
  const checked = checkedIds(bonusIds);
  if (!bonuses) return checked;
  const applicable = new Set(
    bonusesForBosses(bonuses, bosses).map((bonus) => bonus.id),
  );
  return checked.filter((id) => applicable.has(id));
}

// dkp_points у выбранных боссов может быть резолвлен под другую дату (например,
// ещё до выбора даты рейда или из старого значения в БД) — берём актуальное
// значение из списка боссов, уже пересчитанного под режим гильдии на дату рейда.
export function raidDkp(
  selected: Boss[],
  resolved: Boss[],
  bonuses: ResolvedAttendanceBonus[] | undefined,
  bonusIds: number[],
) {
  if (!bonuses) return 0;
  const baseDkp = selected.reduce((sum, boss) => {
    const current = resolved.find((b) => b.id === boss.id);
    return sum + (current?.dkp_points ?? boss.dkp_points);
  }, 0);
  const active = bonuses.filter((bonus) => bonusIds.includes(bonus.id));
  return computeRaidDkp(baseDkp, active);
}

export function participantsLabel(count: number) {
  return `${count} ${plural(count, "участник", "участника", "участников")}`;
}

export function raidLabel(bosses: Boss[], date: Date | null) {
  const dateLabel = date
    ? date.toLocaleString("ru-RU", {
        weekday: "long",
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Moscow",
      })
    : "";
  return [bosses.map((boss) => boss.boss_name).join(", "), dateLabel]
    .filter(Boolean)
    .join(" · ");
}

function toFlags(ids: number[]): IdFlags {
  return Object.fromEntries(ids.map((id) => [id, true]));
}
