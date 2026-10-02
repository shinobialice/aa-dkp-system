"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export const reorderLootQueue = async (orderedIds: number[]) => {
  await ensurePrivilieges(["Администратор"]);
  await Promise.all(
    orderedIds.map((id, index) =>
      sql<any[]>`UPDATE loot_queue SET position = ${index} WHERE id = ${id}`,
    ),
  );
};
