import { UserActivity } from "@/src/components/profile/activity/UserActivity";
import ProfileTabs from "@/src/components/profile/ProfileTabs";
import InventoryTabsClient from "@/src/components/profile/inventory/InventoryTabsClient";
import ProfileInfoClient from "@/src/components/profile/info/ProfileInfoClient";
import { Card } from "@/components/ui/card";
import getTasks from "@/src/actions/getTasks";
import getUserInventory from "@/src/actions/getUserInventory";

export default async function ProfilePage({
  params,
}: {
  params: { user_id: number };
}) {
  const { user_id: userId } = await params;

  const userRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
    { cache: "no-store" }
  );
  if (!userRes.ok) return <>Пользователь не найден</>;

  const notesRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/notes`,
    { cache: "no-store" }
  );

  const user = await userRes.json();
  const inventory = await getUserInventory(userId);
  const tasks = await getTasks(userId);
  const notes = notesRes.ok ? await notesRes.json() : [];

  return (
    <div className="space-y-8 p-4">
      {/* Верхний блок — Активность */}
      <div>
        <UserActivity />
      </div>

      {/* Нижний блок — две колонки: профиль и инвентарь */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        {/* Левая колонка — Профиль и задания */}
        <ProfileInfoClient user={user} />

        {/* Правая колонка — Только инвентарь */}

        <ProfileTabs
          user={user}
          inventory={inventory}
          tasks={tasks}
          // notes={notes}
        />
      </div>
    </div>
  );
}
