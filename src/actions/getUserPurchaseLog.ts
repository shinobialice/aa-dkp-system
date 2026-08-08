"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export type InventoryLogEntry = {
  id: string;
  name: string;
  type: "Куплено" | "Выдано";
  source: "Казна" | "Раздача лута";
  date: string | null;
  quantity: number;
  comment: string | null;
};

export const getUserPurchaseLog = async (
  userId: number,
): Promise<InventoryLogEntry[]> => {
  const [lootResult, giveawayResult] = await Promise.all([
    supabase
      .from("loot")
      .select("id, quantity, comment, status, sold_at, item_type(name)")
      .eq("sold_to_user_id", userId)
      .in("status", ["Продано", "Выдано"]),
    supabase
      .from("givenawayloot")
      .select("id, name, date, comment, status")
      .eq("user_id", userId)
      .eq("status", "Выдано"),
  ]);

  if (lootResult.error) {
    console.error(
      "Ошибка при получении покупок/выдач из казны:",
      lootResult.error,
    );
    throw new Error("Не удалось получить покупки/выдачи из казны");
  }

  if (giveawayResult.error) {
    console.error("Ошибка при получении раздач лута:", giveawayResult.error);
    throw new Error("Не удалось получить раздачи лута");
  }

  const fromTreasury: InventoryLogEntry[] = (lootResult.data ?? []).map(
    (row: any) => ({
      id: `loot-${row.id}`,
      name: row.item_type?.name ?? "Неизвестный предмет",
      type: row.status === "Выдано" ? "Выдано" : "Куплено",
      source: "Казна",
      date: row.sold_at,
      quantity: row.quantity ?? 1,
      comment: row.comment,
    }),
  );

  const fromGiveaway: InventoryLogEntry[] = (giveawayResult.data ?? []).map(
    (row) => ({
      id: `giveaway-${row.id}`,
      name: row.name,
      type: "Выдано",
      source: "Раздача лута",
      date: row.date,
      quantity: 1,
      comment: row.comment,
    }),
  );

  return [...fromTreasury, ...fromGiveaway].sort((a, b) => {
    const at = a.date ? new Date(a.date).getTime() : 0;
    const bt = b.date ? new Date(b.date).getTime() : 0;
    return bt - at;
  });
};
