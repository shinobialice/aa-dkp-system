"use server";

import { requirePromoQuestUser } from "@/server/promoQuests";
import {
  loadVoucherBoard,
  voucherPeriod,
  type VoucherBoard,
} from "@/server/voucherBoard";
import { isGameServer } from "@/shared/config/gameServers";
import { isVoucherAmount, isVoucherZone } from "@/shared/config/voucherBoard";
import sql from "@/shared/lib/db";

export type { VoucherBoard, VoucherZone } from "@/server/voucherBoard";

export async function getVoucherBoard(server: string): Promise<VoucherBoard> {
  await requirePromoQuestUser();
  if (!isGameServer(server)) throw new Error("Неизвестный сервер");

  try {
    return await loadVoucherBoard(server);
  } catch (error) {
    console.error("Ошибка при загрузке векселей:", error);
    throw new Error("Не удалось загрузить, где сдавать ресурсы");
  }
}

export async function reportVoucherAmount(
  server: string,
  zone: string,
  amount: number,
) {
  const { userId } = await requirePromoQuestUser();
  if (!isGameServer(server)) throw new Error("Неизвестный сервер");
  if (!isVoucherZone(zone)) throw new Error("Неизвестная локация");
  if (!isVoucherAmount(amount)) throw new Error("Такого количества не бывает");

  try {
    await sql`
      INSERT INTO voucher_report
        (server, period, zone, amount, user_id, updated_at)
      VALUES (
        ${server}, ${voucherPeriod()}, ${zone}, ${amount}, ${userId}, now()
      )
      ON CONFLICT (server, period, zone) DO UPDATE SET
        amount = EXCLUDED.amount,
        user_id = EXCLUDED.user_id,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении векселя:", error);
    throw new Error("Не удалось сохранить значение");
  }
}
