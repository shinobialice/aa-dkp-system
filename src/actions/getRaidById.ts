"use server";

import sql from "@/shared/lib/db";
import type {
  BossRow,
  ItemTypeRow,
  LootRow,
  RaidAttendanceRow,
  RaidKillcountRow,
  RaidRow,
  UserRow,
} from "@/shared/lib/dbTypes";
import type { KillCount } from "@/widgets/killcount/types";

type RaidBossQueryRow = Pick<
  BossRow,
  "id" | "boss_name" | "dkp_points" | "category"
>;

type AttendanceQueryRow = Pick<
  UserRow,
  "id" | "username" | "active" | "class" | "joined_at"
> &
  Pick<RaidAttendanceRow, "is_late" | "dkp">;

type LootQueryRow = Pick<
  LootRow,
  | "id"
  | "status"
  | "source"
  | "quantity"
  | "price"
  | "sold_to"
  | "acquired_at"
  | "sold_at"
> & {
  item_type_id: ItemTypeRow["id"];
  item_type_name: ItemTypeRow["name"];
  item_type_price: ItemTypeRow["price"];
  item_type_icon_url: ItemTypeRow["icon_url"];
  item_type_grade: ItemTypeRow["grade"];
};

type KillcountQueryRow = Omit<RaidKillcountRow, "raid_id"> &
  Pick<UserRow, "username" | "avatar_url"> & {
    user_class: UserRow["class"];
  };

export type RaidDetails = Awaited<ReturnType<typeof getRaidById>>;
export type RaidDetailsLoot = RaidDetails["loot"][number];
export type RaidDetailsAttendee = RaidDetails["raid_attendance"][number];

export const getRaidById = async (id: string) => {
  const raidId = parseInt(id);

  try {
    const [raid] = await sql<RaidRow[]>`
      SELECT * FROM raid WHERE id = ${raidId}
    `;

    if (!raid) {
      throw new Error("Raid not found");
    }

    const [
      raidBossRows,
      attendanceRows,
      lootRows,
      [activeMembersRow],
      bonusRows,
      killcountRows,
    ] = await Promise.all([
      sql<RaidBossQueryRow[]>`
        SELECT b.id, b.boss_name, b.dkp_points, b.category
        FROM raid_boss rb
        JOIN boss b ON b.id = rb.boss_id
        WHERE rb.raid_id = ${raidId}
      `,
      sql<AttendanceQueryRow[]>`
        SELECT ra.is_late, ra.dkp, u.id, u.username, u.active, u.class, u.joined_at
        FROM raid_attendance ra
        JOIN "user" u ON u.id = ra.user_id
        WHERE ra.raid_id = ${raidId}
      `,
      sql<LootQueryRow[]>`
        SELECT
          l.id, l.status, l.source, l.quantity, l.price, l.sold_to,
          l.acquired_at, l.sold_at,
          it.id AS item_type_id, it.name AS item_type_name, it.price AS item_type_price,
          it.icon_url AS item_type_icon_url, it.grade AS item_type_grade
        FROM loot l
        JOIN item_type it ON it.id = l.item_type_id
        WHERE l.raid_id = ${raidId}
      `,
      // Фолбэк для рейдов, созданных до появления active_user_count.
      sql<{ count: number }[]>`
        SELECT COUNT(*)::int AS count
        FROM "user"
        WHERE active = true
          AND (joined_at IS NULL OR joined_at <= ${raid.start_date})
          AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
      `,
      sql<{ bonus_type_id: number }[]>`
        SELECT bonus_type_id FROM raid_bonus WHERE raid_id = ${raidId}
      `,
      sql<KillcountQueryRow[]>`
        SELECT
          rk.id, rk.user_id, rk.class, rk.start_honor, rk.end_honor,
          rk.start_kills, rk.end_kills, rk.comment,
          u.username, u.avatar_url, u.class AS user_class
        FROM raid_killcount rk
        JOIN "user" u ON u.id = rk.user_id
        WHERE rk.raid_id = ${raidId}
      `,
    ]);

    return {
      ...raid,
      guildActiveMembersAtTime:
        raid.active_user_count ?? activeMembersRow?.count ?? 0,
      bonusTypeIds: bonusRows.map((b) => b.bonus_type_id),
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
        dkp: a.dkp,
        user: {
          id: a.id,
          username: a.username,
          active: a.active,
          class: a.class,
          joined_at: a.joined_at,
        },
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
        itemType: {
          id: l.item_type_id,
          name: l.item_type_name,
          price: l.item_type_price,
          icon_url: l.item_type_icon_url,
          grade: l.item_type_grade,
        },
      })),
      killcount: killcountRows.map(
        (k): KillCount => ({
          id: k.id,
          userId: k.user_id,
          userName: k.username,
          role: k.user_class,
          avatarUrl: k.avatar_url,
          playerClass: k.class,
          startHonor: k.start_honor,
          endHonor: k.end_honor,
          startKills: k.start_kills,
          endKills: k.end_kills,
          comment: k.comment ?? undefined,
        }),
      ),
    };
  } catch (error) {
    console.error("Ошибка при получении рейда:", error);
    throw new Error("Не удалось найти рейд");
  }
};
