import sql from "@/shared/lib/db";
import type {
  GivenawaylootRow,
  ItemTypeRow,
  LootWishlistRow,
  MiscLootGrantsRow,
  UserRow,
} from "@/shared/lib/dbTypes";
import { hasTag } from "@/actions/hasTag";
import { getSessionUserId } from "@/actions/getSessionUserId";
import LootGiveaway from "@/widgets/Loot/LootGiveaway";
import { lootColumns } from "@/widgets/Loot/LootGiveaway/lootColumns";
import { gliderTypes } from "@/widgets/Loot/LootGiveaway/gliderTypes";
import { treasuryNameByGiveawayName } from "@/widgets/Loot/LootGiveaway/treasuryGiveawaySync";
import type {
  GiveawayStatus,
  Player,
  TrackedItem,
} from "@/widgets/Loot/LootGiveaway/giveawayModel";
import { cookies } from "next/headers";

export default async function Page() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [isAdmin, currentUserId] = await Promise.all([
    hasTag(sessionToken, ["Администратор"]),
    getSessionUserId(),
  ]);

  let users: Pick<UserRow, "id" | "username" | "active" | "avatar_url">[];
  let giveawayRows: Pick<
    GivenawaylootRow,
    "user_id" | "name" | "date" | "status"
  >[];
  let miscGrantRows: Pick<
    MiscLootGrantsRow,
    "user_id" | "id" | "comment" | "amount" | "date"
  >[];
  let wishlistRows: Pick<
    LootWishlistRow,
    "user_id" | "id" | "item_name" | "comment"
  >[];
  let itemTypeRows: Pick<ItemTypeRow, "name" | "icon_url" | "grade">[];
  try {
    [users, giveawayRows, miscGrantRows, wishlistRows, itemTypeRows] =
      await Promise.all([
        sql<typeof users>`
          SELECT id, username, active, avatar_url FROM "user" ORDER BY id ASC
        `,
        sql<typeof giveawayRows>`
          SELECT user_id, name, date, status FROM givenawayloot
        `,
        sql<typeof miscGrantRows>`
          SELECT user_id, id, comment, amount, date FROM misc_loot_grants
        `,
        sql<typeof wishlistRows>`
          SELECT user_id, id, item_name, comment FROM loot_wishlist
        `,
        sql<typeof itemTypeRows>`SELECT name, icon_url, grade FROM item_type`,
      ]);
  } catch (error) {
    console.error("Failed to load users:", error);
    return <div>Error loading loot data.</div>;
  }

  // У фиксированных колонок раздачи нет ссылки на item_type, иконка ищется по имени.
  const itemTypeByName = new Map(
    itemTypeRows.map((it) => [
      it.name,
      { iconUrl: it.icon_url, grade: it.grade },
    ]),
  );

  const items: TrackedItem[] = [
    ...lootColumns.map((name) => ({ name, kind: "loot" as const })),
    ...gliderTypes.map((name) => ({ name, kind: "glider" as const })),
  ].map(({ name, kind }) => {
    const itemType =
      itemTypeByName.get(name) ??
      itemTypeByName.get(treasuryNameByGiveawayName.get(name) ?? "");
    return {
      name,
      kind,
      iconUrl: itemType?.iconUrl ?? null,
      grade: itemType?.grade ?? null,
    };
  });

  const giveawayByUser = Map.groupBy(giveawayRows, (row) => row.user_id);
  const miscGrantsByUser = Map.groupBy(miscGrantRows, (row) => row.user_id);
  const wishlistByUser = Map.groupBy(wishlistRows, (row) => row.user_id);

  const initialPlayers: Player[] = users.map((user) => {
    const givenawayloot = giveawayByUser.get(user.id) ?? [];
    return {
      id: user.id,
      username: user.username,
      active: user.active,
      avatarUrl: user.avatar_url,
      items: items.map(({ name }) => {
        const record = givenawayloot.find((i) => i.name === name);
        return {
          name,
          date: record?.date?.split("T")[0] || "",
          status: (record?.status || "") as GiveawayStatus,
        };
      }),
      miscGrants: (miscGrantsByUser.get(user.id) ?? [])
        .map((g) => ({
          id: Number(g.id),
          comment: g.comment,
          amount: g.amount,
          date: g.date.split("T")[0],
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      wishlist: (wishlistByUser.get(user.id) ?? []).map((w) => ({
        id: Number(w.id),
        itemName: w.item_name,
        comment: w.comment,
      })),
    };
  });

  return (
    <LootGiveaway
      items={items}
      initialPlayers={initialPlayers}
      isAdmin={isAdmin}
      currentUserId={currentUserId ?? null}
    />
  );
}
