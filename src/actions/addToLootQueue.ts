"use server";

import sql from "@/shared/lib/db";
import type { LootQueueRow } from "@/shared/lib/dbTypes";
import { publishChanges } from "@/server/liveChanges";
import { LOOT_BUY_LINK } from "@/server/lootQueueNotifications";
import { notifyUser } from "@/server/notifications";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";

export const addToLootQueue = async (username: string, itemName: string) => {
  await ensurePrivilieges(["Администратор"]);
  const adminId = await getSessionUserId();
  const [user] = await sql<{ id: number }[]>`
    SELECT id FROM "user" WHERE username = ${username}
  `;
  if (!user) {
    throw new Error("User not found");
  }

  const [item] = await sql<{ id: number }[]>`
    SELECT id FROM item_type WHERE name = ${itemName}
  `;
  if (!item) {
    throw new Error("Item not found");
  }

  const newEntry = await sql.begin(async (tx) => {
    const [entry] = await tx<LootQueueRow[]>`
      INSERT INTO loot_queue
        (user_id, item_type_id, status, required, delivered, synth_target, created_at)
      VALUES
        (${user.id}, ${item.id}, 'ожидание', 1, 0, '', now())
      RETURNING *
    `;
    if (!entry) {
      throw new Error("Failed to insert into loot queue");
    }
    if (user.id !== adminId) {
      await notifyUser(tx, {
        userId: user.id,
        kind: "lootQueueAdded",
        message: `Вас поставили в очередь на «${itemName}»`,
        link: LOOT_BUY_LINK,
      });
    }
    return entry;
  });

  await publishChanges("notifications");
  return newEntry;
};
