import { prisma } from "@/lib/db";
import LootGiveaway from "@/src/components/Loot/LootGiveaway";
import { lootColumns } from "@/src/components/Loot/LootGiveaway/lootColumns";

export default async function Page() {
  const users = await prisma.user.findMany({
    include: {
      inventory: true,
      givenAwayLoot: true,
    },
  });

  const initialPlayers = users.map((user) => ({
    id: user.id,
    username: user.username,
    active: user.active,
    loot: lootColumns.map((name) => {
      const record = user.givenAwayLoot.find((i) => i.name === name);
      return {
        name,
        date: record?.date.toISOString().split("T")[0] || "",
        comment: record?.comment || "",
        status: record?.status || "",
      };
    }),
  }));

  return <LootGiveaway initialPlayers={initialPlayers} />;
}
