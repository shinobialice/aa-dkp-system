"use server";

import sql from "@/shared/lib/db";

export const reorderLootQueue = async (orderedIds: number[]) => {
  await Promise.all(
    orderedIds.map((id, index) =>
      sql<any[]>`UPDATE loot_queue SET position = ${index} WHERE id = ${id}`,
    ),
  );
};
