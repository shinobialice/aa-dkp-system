"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import { hasTag } from "@/actions/hasTag";
import LootGiveaway from "@/widgets/Loot/LootGiveaway";
import { lootColumns } from "@/widgets/Loot/LootGiveaway/lootColumns";
import { gliderTypes } from "@/widgets/Loot/LootGiveaway/gliderTypes";
import { cookies } from "next/headers";

export default async function Page() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  const { data: users, error } = await supabase
    .from("user")
    .select(
      "id, username, active, givenawayloot(name, date, status), misc_loot_grants(id, comment, amount, date), loot_wishlist(id, item_name, comment)",
    )
    .order("id", { ascending: true });

  if (error || !users) {
    console.error("Failed to load users:", error);
    return <div>Error loading loot data.</div>;
  }

  const initialPlayers = users.map((user) => ({
    id: user.id,
    username: user.username,
    active: user.active,
    loot: lootColumns.map((name) => {
      const record = user.givenawayloot?.find((i) => i.name === name);
      return {
        name,
        date: record?.date?.split("T")[0] || "",
        status: record?.status || "",
      };
    }),
    gliders: gliderTypes.map((type) => {
      const record = user.givenawayloot?.find((i) => i.name === type);
      return {
        type,
        date: record?.date?.split("T")[0] || "",
        status: record?.status || "",
      };
    }),
    miscGrants: (user.misc_loot_grants ?? [])
      .map((g) => ({
        id: g.id,
        comment: g.comment,
        amount: g.amount === null ? null : Number(g.amount),
        date: g.date?.split("T")[0] || "",
      }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    wishlist: (user.loot_wishlist ?? []).map((w) => ({
      id: w.id,
      itemName: w.item_name,
      comment: w.comment,
    })),
  }));

  return <LootGiveaway isAdmin={isAdmin} initialPlayers={initialPlayers} />;
}
