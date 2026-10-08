"use server";

import {
  ensureOwnCharacter,
  requirePromoQuestUser,
} from "@/server/promoQuests";
import sql from "@/shared/lib/db";
import type { PromoCharacterRow, PromoProgressRow } from "@/shared/lib/dbTypes";
import { doneKey } from "@/widgets/PromoQuests/promoQuestsModel";
import { findPromoWeek } from "@/widgets/PromoQuests/promoWeeks";

export type PromoCharacter = Pick<
  PromoCharacterRow,
  "id" | "name" | "group_id" | "server"
>;

export type PromoWeekData = {
  characters: PromoCharacter[];
  doneKeys: string[];
};

type ProgressMark = Pick<
  PromoProgressRow,
  "character_id" | "quest_id" | "day_index"
>;

export async function getPromoWeek(weekStart: string): Promise<PromoWeekData> {
  const { userId, slug, weeks } = await requirePromoQuestUser();
  if (!findPromoWeek(weeks, weekStart)) {
    throw new Error("Такой недели в ивенте нет");
  }

  try {
    const [characters, marks] = await Promise.all([
      sql<PromoCharacter[]>`
        SELECT id, name, group_id, server FROM promo_character
        WHERE user_id = ${userId}
        ORDER BY position, id
      `,
      sql<ProgressMark[]>`
        SELECT p.character_id, p.quest_id, p.day_index
        FROM promo_progress p
        JOIN promo_character c ON c.id = p.character_id
        WHERE c.user_id = ${userId} AND p.event = ${slug}
          AND p.week_start = ${weekStart}
      `,
    ]);
    return {
      characters,
      doneKeys: marks.map((mark) =>
        doneKey(mark.character_id, mark.quest_id, mark.day_index),
      ),
    };
  } catch (error) {
    console.error("Ошибка при загрузке квестов ивента:", error);
    throw new Error("Не удалось загрузить квесты ивента");
  }
}

export async function setPromoQuestDone(
  characterId: number,
  weekStart: string,
  questId: number,
  dayIndex: number,
  isDone: boolean,
) {
  const { userId, slug, weeks } = await requirePromoQuestUser();
  const week = findPromoWeek(weeks, weekStart);
  if (!week?.quests.some((quest) => quest.id === questId)) {
    throw new Error("Такого квеста на этой неделе нет");
  }
  if (!Number.isInteger(dayIndex) || dayIndex < 0 || dayIndex > 6) {
    throw new Error("Некорректный день недели");
  }
  await ensureOwnCharacter(userId, characterId);

  try {
    if (isDone) {
      await sql`
        INSERT INTO promo_progress
          (character_id, event, week_start, quest_id, day_index)
        VALUES (
          ${characterId}, ${slug}, ${weekStart}, ${questId}, ${dayIndex}
        )
        ON CONFLICT DO NOTHING
      `;
    } else {
      await sql`
        DELETE FROM promo_progress
        WHERE character_id = ${characterId} AND event = ${slug}
          AND week_start = ${weekStart}
          AND quest_id = ${questId} AND day_index = ${dayIndex}
      `;
    }
  } catch (error) {
    console.error("Ошибка при отметке квеста ивента:", error);
    throw new Error("Не удалось сохранить отметку");
  }
}
