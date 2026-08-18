"use server";

import sql from "@/shared/lib/db";

export const getRaidById = async (id: string) => {
  const raidId = parseInt(id);

  try {
    const [raid] = await sql<any[]>`
      SELECT * FROM raid WHERE id = ${raidId}
    `;

    if (!raid) {
      throw new Error("Raid not found");
    }

    const [raidBossRows, attendanceRows, lootRows] = await Promise.all([
      sql<any[]>`
        SELECT b.id, b.boss_name, b.dkp_points, b.category
        FROM raid_boss rb
        JOIN boss b ON b.id = rb.boss_id
        WHERE rb.raid_id = ${raidId}
      `,
      sql<any[]>`
        SELECT ra.is_late, u.id, u.username, u.active, u.class
        FROM raid_attendance ra
        JOIN "user" u ON u.id = ra.user_id
        WHERE ra.raid_id = ${raidId}
      `,
      sql<any[]>`
        SELECT
          l.id, l.status, l.source, l.quantity, l.price, l.sold_to,
          l.acquired_at, l.sold_at,
          it.id AS item_type_id, it.name AS item_type_name, it.price AS item_type_price
        FROM loot l
        JOIN item_type it ON it.id = l.item_type_id
        WHERE l.raid_id = ${raidId}
      `,
    ]);

    return {
      ...raid,
      raid_boss: raidBossRows.map((b) => ({
        boss: {
          id: b.id,
          boss_name: b.boss_name,
          dkp_points: b.dkp_points,
          category: b.category,
        },
      })),
      raid_attendance: attendanceRows.map((a) => ({
        is_late: a.is_late,
        user: { id: a.id, username: a.username, active: a.active, class: a.class },
      })),
      loot: lootRows.map((l) => ({
        id: l.id,
        status: l.status,
        source: l.source,
        quantity: l.quantity,
        price: l.price,
        sold_to: l.sold_to,
        acquired_at: l.acquired_at,
        sold_at: l.sold_at,
        itemType: { id: l.item_type_id, name: l.item_type_name, price: l.item_type_price },
      })),
    };
  } catch (error) {
    console.error("Ошибка при получении рейда:", error);
    throw new Error("Не удалось найти рейд");
  }
};
