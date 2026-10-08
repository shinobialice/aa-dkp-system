import "server-only";
import { cookies } from "next/headers";
import { getEventSettings, type EventSettings } from "@/actions/eventSettings";
import { hasTag } from "@/actions/hasTag";
import {
  promoPath,
  type PromoLink,
  type PromoSlug,
} from "@/shared/config/promoPages";
import { isEventActive } from "@/shared/lib/eventStatus";

export type PromoEvent = EventSettings & {
  promo: PromoSlug;
  startsAt: string;
};

// Админ видит страницу и до старта ивента, чтобы проверить ее заранее.
export async function getCurrentPromoEvent(): Promise<PromoEvent | null> {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [event, isAdmin] = await Promise.all([
    getEventSettings(),
    hasTag(sessionToken, ["Администратор"]),
  ]);
  const { promo, startsAt } = event;
  if (promo === null || startsAt === null) return null;
  if (!isAdmin && !isEventActive(event)) return null;
  return { ...event, promo, startsAt };
}

export async function getActivePromoLink(): Promise<PromoLink | null> {
  let event: EventSettings;
  try {
    event = await getEventSettings();
  } catch (error) {
    console.error("Не удалось проверить промо-ивент для меню:", error);
    return null;
  }
  if (!event.promo || !event.title || !isEventActive(event)) return null;
  return { title: event.title, url: promoPath(event.promo) };
}
