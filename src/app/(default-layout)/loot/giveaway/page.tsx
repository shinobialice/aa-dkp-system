"use server";
import supabase from "@/shared/lib/supabase";
import { hasTag } from "@/actions/hasTag";
import LootGiveaway from "@/widgets/Loot/LootGiveaway";
import { lootColumns } from "@/widgets/Loot/LootGiveaway/lootColumns";
import { cookies } from "next/headers";

export default async function Page() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  const { data: users, error } = await supabase
    .from("user")
    .select("id, username, active, givenawayloot(name, date, comment, status)")
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
        comment: record?.comment || "",
        status: record?.status || "",
      };
    }),
  }));

  return <LootGiveaway isAdmin={isAdmin} initialPlayers={initialPlayers} />;
}
