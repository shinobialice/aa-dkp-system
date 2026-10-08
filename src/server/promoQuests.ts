import "server-only";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { PROMO_QUEST_EVENTS } from "@/shared/config/promoQuests";
import sql from "@/shared/lib/db";
import type { PromoCharacterRow } from "@/shared/lib/dbTypes";
import { promoStartKey, promoWeeks } from "@/widgets/PromoQuests/promoWeeks";
import { getCurrentPromoEvent } from "./promo";

export async function requirePromoQuestUser() {
  const event = await getCurrentPromoEvent();
  if (!event) throw new Error("Ивент сейчас недоступен");
  const userId = await getSessionUserId();
  if (userId === null) throw new Error("Нужно войти на сайт");
  const weeks = promoWeeks(
    PROMO_QUEST_EVENTS[event.promo],
    promoStartKey(event.startsAt),
  );
  return { userId, slug: event.promo, weeks };
}

export async function ensureOwnCharacter(userId: number, characterId: number) {
  if (!Number.isInteger(characterId)) throw new Error("Некорректный персонаж");
  const [character] = await sql<Pick<PromoCharacterRow, "id" | "group_id">[]>`
    SELECT id, group_id FROM promo_character
    WHERE id = ${characterId} AND user_id = ${userId}
  `;
  if (!character) throw new Error("Персонаж не найден");
  return character;
}
