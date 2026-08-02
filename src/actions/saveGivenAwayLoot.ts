"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const saveGivenAwayLoot = async (
  userId: number,
  item: { name: string; date: string; comment?: string; status: string },
) => {
  const dateObj = new Date(item.date).toISOString();

  const { data: existing, error: findError } = await supabase
    .from("givenawayloot")
    .select("id")
    .eq("user_id", userId)
    .eq("name", item.name)
    .maybeSingle();

  if (findError) {
    console.error("Ошибка при поиске записи givenawayloot:", findError);
    throw new Error("Не удалось сохранить выданный лут");
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("givenawayloot")
      .update({
        date: dateObj,
        comment: item.comment,
        status: item.status,
      })
      .eq("id", existing.id);

    if (updateError) {
      throw new Error("Ошибка при обновлении выданного лута");
    }
  } else {
    const { error: insertError } = await supabase.from("givenawayloot").insert([
      {
        user_id: userId,
        name: item.name,
        date: dateObj,
        comment: item.comment,
        status: item.status,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      throw new Error("Ошибка при создании выданного лута");
    }
  }

  if (item.status === "Выдано") {
    const { data: existingInventory, error: inventoryFindError } =
      await supabase
        .from("user_inventory")
        .select("id, type")
        .eq("user_id", userId)
        .eq("name", item.name)
        .limit(1);

    if (inventoryFindError) {
      console.error("Ошибка при поиске инвентаря:", inventoryFindError);
      throw new Error("Не удалось проверить инвентарь");
    }

    const inventoryRow = existingInventory?.[0] ?? null;

    if (!inventoryRow) {
      const { error: insertInventoryError } = await supabase
        .from("user_inventory")
        .insert([
          {
            user_id: userId,
            name: item.name,
            type: "Выдано",
            created_at: dateObj,
          },
        ]);

      if (insertInventoryError) {
        throw new Error("Ошибка при добавлении предмета в инвентарь");
      }
    } else if (inventoryRow.type === "Выдано") {
      const { error: updateInventoryError } = await supabase
        .from("user_inventory")
        .update({ created_at: dateObj })
        .eq("id", inventoryRow.id);

      if (updateInventoryError) {
        throw new Error("Ошибка при обновлении инвентаря");
      }
    }
  } else {
    const { error: deleteError } = await supabase
      .from("user_inventory")
      .delete()
      .eq("user_id", userId)
      .eq("name", item.name)
      .eq("type", "Выдано");

    if (deleteError) {
      throw new Error("Ошибка при удалении предмета из инвентаря");
    }
  }
};
