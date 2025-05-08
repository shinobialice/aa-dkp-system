
import supabase from "@/lib/supabase";
import LootGiveaway from "@/src/components/Loot/LootGiveaway";
import { lootColumns } from "@/src/components/Loot/LootGiveaway/lootColumns";

export default async function Page() {
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

  return <LootGiveaway initialPlayers={initialPlayers} />;
}
