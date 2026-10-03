"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export const reorderLootQueue = async (orderedIds: number[]) => {
  await ensurePrivilieges(["Администратор"]);
  await sql.begin(async (tx) => {
    for (const [index, id] of orderedIds.entries()) {
      await tx`UPDATE loot_queue SET position = ${index} WHERE id = ${id}`;
    }
  });
};
