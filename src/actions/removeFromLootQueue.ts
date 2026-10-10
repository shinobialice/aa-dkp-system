"use server";

import sql from "@/shared/lib/db";
import type { ItemTypeRow, LootQueueRow } from "@/shared/lib/dbTypes";
import { publishChanges } from "@/server/liveChanges";
import { LOOT_BUY_LINK } from "@/server/lootQueueNotifications";
import { notifyUser } from "@/server/notifications";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";

type RemovedEntry = Pick<LootQueueRow, "user_id"> & Pick<ItemTypeRow, "name">;

export const removeFromLootQueue = async (lootQueueId: number) => {
  await ensurePrivilieges(["Администратор"]);
  const adminId = await getSessionUserId();
  try {
    await sql.begin(async (tx) => {
      const [removed] = await tx<RemovedEntry[]>`
        DELETE FROM loot_queue lq
        USING item_type it
        WHERE lq.id = ${lootQueueId} AND it.id = lq.item_type_id
        RETURNING lq.user_id, it.name
      `;
      if (!removed || removed.user_id === adminId) return;
      await notifyUser(tx, {
        userId: removed.user_id,
        kind: "lootQueueRemoved",
        message: `Вас убрали из очереди на «${removed.name}»`,
        link: LOOT_BUY_LINK,
      });
    });
  } catch (error) {
    console.error("Ошибка при удалении из очереди:", error);
    throw new Error("Не удалось удалить запись из очереди");
  }
  await publishChanges("notifications");
};
