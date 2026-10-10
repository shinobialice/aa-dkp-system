import { cookies } from "next/headers";
import { getLootGrouped } from "@/actions/getLootGrouped";
import { getLootStock } from "@/actions/getLootStock";
import { getAllLootQueues } from "@/actions/getAllLootQueues";
import { getMyLootQueueRequests } from "@/actions/lootQueueRequests";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import LootBuyClient from "@/widgets/Loot/LootBuy/LootBuyClient";
import { MISC_SOURCE, type BuyItem } from "@/widgets/Loot/LootBuy/lootBuyModel";

export default async function LootBuyPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [
    lootBySource,
    stock,
    queues,
    myRequests,
    activeUsers,
    isAdmin,
    currentUserId,
  ] = await Promise.all([
    getLootGrouped(),
    getLootStock(),
    getAllLootQueues(),
    getMyLootQueueRequests(),
    getActiveUsers(),
    hasTag(sessionToken, ["Администратор"]),
    getSessionUserId(),
  ]);

  const sources = [
    ...Object.keys(lootBySource).filter((source) => source !== MISC_SOURCE),
    ...(lootBySource[MISC_SOURCE] ? [MISC_SOURCE] : []),
  ];
  const items: BuyItem[] = sources.flatMap((source) =>
    lootBySource[source].map((item) => ({
      name: item.name,
      source,
      price: item.price === null ? null : Number(item.price),
      icon: item.icon,
      grade: item.grade,
      stock: stock[item.name] ?? 0,
    })),
  );

  return (
    <LootBuyClient
      initialItems={items}
      sources={sources}
      initialQueues={queues}
      initialRequests={myRequests}
      players={activeUsers.map((user) => ({
        id: user.id as number,
        username: user.username as string,
      }))}
      isAdmin={isAdmin}
      currentUserId={currentUserId ?? null}
    />
  );
}
