import { MARATHON_QUEST_WEEKS } from "./marathonQuestsData";
import type { PromoSlug } from "./promoPages";
import type { VoucherResource } from "./voucherBoard";

export type PromoQuestVoucher = { resource: VoucherResource; amount: number };

export type PromoQuest = {
  id: number;
  name: string;
  hint: string;
  points: number;
  bossHour?: number;
  voucher?: PromoQuestVoucher;
};

export type PromoQuestEvent = {
  weeklyGoal: number;
  weeks: PromoQuest[][];
};

export const PROMO_QUEST_EVENTS: Record<PromoSlug, PromoQuestEvent> = {
  marathon: { weeklyGoal: 100, weeks: MARATHON_QUEST_WEEKS },
};
