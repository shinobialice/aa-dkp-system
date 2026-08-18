"use server";

import sql from "@/shared/lib/db";

export const addToLootQueue = async (username: string, itemName: string) => {
  const [user] = await sql<any[]>`
    SELECT id FROM "user" WHERE username = ${username}
  `;
  if (!user) {
    throw new Error("User not found");
  }

  const [item] = await sql<any[]>`
    SELECT id FROM item_type WHERE name = ${itemName}
  `;
  if (!item) {
    throw new Error("Item not found");
  }

  const [newEntry] = await sql<any[]>`
    INSERT INTO loot_queue
      (user_id, item_type_id, status, required, delivered, synth_target, created_at)
    VALUES
      (${user.id}, ${item.id}, 'ожидание', 1, 0, '', now())
    RETURNING *
  `;

  if (!newEntry) {
    throw new Error("Failed to insert into loot queue");
  }

  return newEntry;
};
