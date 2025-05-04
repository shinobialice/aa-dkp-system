// app/loot/giveaway/page.tsx
import { getAllUsers } from "@/src/actions/getAllUsers";
import LootGiveaway from "@/src/components/Loot/LootGiveaway";

export default async function Page() {
  const users = await getAllUsers();

  const initialPlayers = users.map((user) => ({
    id: user.id,
    username: user.username,
    active: user.active,
    loot: [
      "Ро'кана, Безумие морей",
      "Анд'хакар, Чернильная тьма",
      "Глайдер охотника на драконов",
      "Фрегат",
      "Прочее",
      "Прочее 2",
    ].map((name) => ({
      name,
      date: "",
      comment: "",
    })),
  }));

  return <LootGiveaway initialPlayers={initialPlayers} />;
}
