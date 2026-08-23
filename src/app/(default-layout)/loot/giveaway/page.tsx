"use server";
import sql from "@/shared/lib/db";
import { hasTag } from "@/actions/hasTag";
import LootGiveaway from "@/widgets/Loot/LootGiveaway";
import { lootColumns } from "@/widgets/Loot/LootGiveaway/lootColumns";
import { gliderTypes } from "@/widgets/Loot/LootGiveaway/gliderTypes";
import { cookies } from "next/headers";

export default async function Page() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  let users, giveawayRows, miscGrantRows, wishlistRows, itemTypeRows;
  try {
    [users, giveawayRows, miscGrantRows, wishlistRows, itemTypeRows] =
      await Promise.all([
        sql<any[]>`SELECT id, username, active, avatar_url FROM "user" ORDER BY id ASC`,
        sql<any[]>`SELECT user_id, name, date, status FROM givenawayloot`,
        sql<any[]>`SELECT user_id, id, comment, amount, date FROM misc_loot_grants`,
        sql<any[]>`SELECT user_id, id, item_name, comment FROM loot_wishlist`,
        sql<any[]>`SELECT name, icon_url, grade FROM item_type`,
      ]);
  } catch (error) {
    console.error("Failed to load users:", error);
    return <div>Error loading loot data.</div>;
  }

  // lootColumns/gliderTypes — фиксированные названия, без своей ссылки на
  // item_type — подтягиваем иконку/грейд по совпадению имени с казной, если
  // такой предмет там есть (у части названий тут его нет, тогда просто без
  // иконки, как и раньше).
  const itemTypeByName = new Map(
    itemTypeRows.map((it) => [it.name, { iconUrl: it.icon_url, grade: it.grade }]),
  );

  const giveawayByUser = new Map<number, any[]>();
  for (const g of giveawayRows) {
    if (!giveawayByUser.has(g.user_id)) giveawayByUser.set(g.user_id, []);
    giveawayByUser.get(g.user_id)!.push(g);
  }
  const miscGrantsByUser = new Map<number, any[]>();
  for (const g of miscGrantRows) {
    if (!miscGrantsByUser.has(g.user_id)) miscGrantsByUser.set(g.user_id, []);
    miscGrantsByUser.get(g.user_id)!.push(g);
  }
  const wishlistByUser = new Map<number, any[]>();
  for (const w of wishlistRows) {
    if (!wishlistByUser.has(w.user_id)) wishlistByUser.set(w.user_id, []);
    wishlistByUser.get(w.user_id)!.push(w);
  }

  const initialPlayers = users.map((user) => {
    const givenawayloot = giveawayByUser.get(user.id) ?? [];
    return {
      id: user.id,
      username: user.username,
      active: user.active,
      avatarUrl: user.avatar_url,
      loot: lootColumns.map((name) => {
        const record = givenawayloot.find((i) => i.name === name);
        const itemType = itemTypeByName.get(name);
        return {
          name,
          date: record?.date?.split("T")[0] || "",
          status: record?.status || "",
          iconUrl: itemType?.iconUrl ?? null,
          grade: itemType?.grade ?? null,
        };
      }),
      gliders: gliderTypes.map((type) => {
        const record = givenawayloot.find((i) => i.name === type);
        const itemType = itemTypeByName.get(type);
        return {
          type,
          date: record?.date?.split("T")[0] || "",
          status: record?.status || "",
          iconUrl: itemType?.iconUrl ?? null,
          grade: itemType?.grade ?? null,
        };
      }),
      miscGrants: (miscGrantsByUser.get(user.id) ?? [])
        .map((g) => ({
          id: g.id,
          comment: g.comment,
          amount: g.amount === null ? null : Number(g.amount),
          date: g.date?.split("T")[0] || "",
        }))
        .sort((a, b) => a.date.localeCompare(b.date)),
      wishlist: (wishlistByUser.get(user.id) ?? []).map((w) => ({
        id: w.id,
        itemName: w.item_name,
        comment: w.comment,
      })),
    };
  });

  return <LootGiveaway isAdmin={isAdmin} initialPlayers={initialPlayers} />;
}
