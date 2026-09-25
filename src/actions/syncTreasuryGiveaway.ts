import "server-only";
import type { TransactionSql } from "postgres";
import { treasuryGiveawaySyncItems } from "@/widgets/Loot/LootGiveaway/treasuryGiveawaySync";

export async function syncTreasuryGiveaway(
  sql: TransactionSql,
  {
    treasuryName,
    userId,
    givenAt,
  }: { treasuryName: string; userId: number; givenAt: string },
) {
  const item = treasuryGiveawaySyncItems.find(
    (i) => i.treasuryName === treasuryName,
  );
  if (!item) return;

  const date = new Date(givenAt).toISOString();

  const [existing] = await sql<any[]>`
    SELECT id, status FROM givenawayloot
    WHERE user_id = ${userId} AND name = ${item.giveawayName}
    LIMIT 1
  `;

  if (!existing) {
    await sql`
      INSERT INTO givenawayloot (user_id, name, date, status, created_at)
      VALUES (${userId}, ${item.giveawayName}, ${date}, 'Выдано', now())
    `;
  } else if (existing.status !== "Выдано") {
    await sql`
      UPDATE givenawayloot SET status = 'Выдано', date = ${date}
      WHERE id = ${existing.id}
    `;
  }

  const [profileItem] = await sql<any[]>`
    SELECT id FROM user_inventory
    WHERE user_id = ${userId} AND name = ${item.profileName} AND type = ${item.profileType}
    LIMIT 1
  `;

  if (!profileItem) {
    await sql`
      INSERT INTO user_inventory (user_id, name, type, created_at)
      VALUES (${userId}, ${item.profileName}, ${item.profileType}, now())
    `;
  }
}
