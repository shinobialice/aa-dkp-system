"use server";

import sql from "@/shared/lib/db";

export const getLootQueueByItemName = async (itemName: string) => {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT
        lq.id,
        lq.user_id,
        lq.status,
        lq.synth_target,
        lq.required,
        lq.delivered,
        lq.created_at,
        lq.roll,
        lq.position,
        u.username
      FROM loot_queue lq
      JOIN item_type it ON it.id = lq.item_type_id
      LEFT JOIN "user" u ON u.id = lq.user_id
      WHERE it.name = ${itemName}
    `;
  } catch (error) {
    console.error(error);
    return [];
  }

  return rows
    .map((entry) => ({
      id: entry.id,
      userId: entry.user_id,
      username: entry.username || "Unknown",
      status: entry.status,
      synth_target: entry.synth_target,
      required: entry.required ?? 0,
      delivered: entry.delivered ?? 0,
      createdAt: entry.created_at,
      roll: entry.roll,
      position: entry.position,
    }))
    .sort((a, b) => {
      if (a.position !== null && b.position !== null) {
        return a.position - b.position;
      }
      if (a.position !== null) return -1;
      if (b.position !== null) return 1;
      return (
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
};
