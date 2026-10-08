import type { PromoCharacter } from "@/actions/promoQuestActions";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { plural } from "@/shared/lib/format";
import { WEEK_DAY_NAMES } from "./promoWeeks";

export const MAX_CHARACTER_NAME_LENGTH = 40;

export type DoneMarks = Set<string>;

export function doneKey(characterId: number, questId: number, day: number) {
  return `${characterId}:${questId}:${day}`;
}

export function withOverrides(
  doneKeys: string[],
  overrides: Record<string, boolean>,
  weekStart: string,
): DoneMarks {
  const marks = new Set(doneKeys);
  const prefix = `${weekStart}:`;
  for (const [key, isDone] of Object.entries(overrides)) {
    if (!key.startsWith(prefix)) continue;
    const markKey = key.slice(prefix.length);
    if (isDone) marks.add(markKey);
    else marks.delete(markKey);
  }
  return marks;
}

export function isQuestDone(
  marks: DoneMarks,
  characterId: number | null,
  questId: number,
  day: number,
) {
  if (characterId === null) return false;
  return marks.has(doneKey(characterId, questId, day));
}

export function questDoneCount(
  marks: DoneMarks,
  characterId: number | null,
  questId: number,
) {
  return WEEK_DAY_NAMES.filter((_, day) =>
    isQuestDone(marks, characterId, questId, day),
  ).length;
}

export function characterScore(
  marks: DoneMarks,
  characterId: number | null,
  quests: PromoQuest[],
) {
  return quests.reduce(
    (sum, quest) =>
      sum + quest.points * questDoneCount(marks, characterId, quest.id),
    0,
  );
}

export function dayScore(
  marks: DoneMarks,
  characterId: number | null,
  quests: PromoQuest[],
  day: number,
) {
  return quests
    .filter((quest) => isQuestDone(marks, characterId, quest.id, day))
    .reduce((sum, quest) => sum + quest.points, 0);
}

export function fullDayScore(quests: PromoQuest[]) {
  return quests.reduce((sum, quest) => sum + quest.points, 0);
}

export function groupOf(
  characters: PromoCharacter[],
  character: PromoCharacter,
) {
  if (character.group_id === null) return [character];
  return characters.filter((other) => other.group_id === character.group_id);
}

export function goalScore(
  marks: DoneMarks,
  characters: PromoCharacter[],
  character: PromoCharacter,
  quests: PromoQuest[],
) {
  return groupOf(characters, character).reduce(
    (sum, member) => sum + characterScore(marks, member.id, quests),
    0,
  );
}

export function groupBreakdown(
  marks: DoneMarks,
  group: PromoCharacter[],
  quests: PromoQuest[],
) {
  return group
    .map(
      (member) => `${member.name} ${characterScore(marks, member.id, quests)}`,
    )
    .join(" + ");
}

export function initialPartnerId(
  characters: PromoCharacter[],
  character: PromoCharacter | undefined,
) {
  if (!character) return null;
  const partner = groupOf(characters, character).find(
    (member) => member.id !== character.id,
  );
  return partner?.id ?? null;
}

export function pointsTone(points: number) {
  if (points >= 5) return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
  if (points >= 4) {
    return "bg-violet-500/15 text-violet-700 dark:text-violet-400";
  }
  if (points >= 2) return "bg-sky-500/15 text-sky-700 dark:text-sky-400";
  return "bg-muted text-muted-foreground";
}

export function goalPercent(score: number, goal: number) {
  return Math.min(100, (score / goal) * 100);
}

export function remainingHint(score: number, perDay: number, goal: number) {
  const remaining = goal - score;
  if (remaining <= 0) return "Цель недели выполнена";
  if (perDay === 0) return "Квестов на этой неделе нет";
  const days = Math.ceil(remaining / perDay);
  return `Если сдавать все квесты — ${days} ${plural(days, "день", "дня", "дней")}`;
}

export function pointsLabel(points: number) {
  return `${points} ${plural(points, "балл", "балла", "баллов")}`;
}
