"use server";
import sql from "@/shared/lib/db";
import type { UserInventoryRow } from "@/shared/lib/dbTypes";
import ensureCanEditUserData from "./ensureCanEditUserData";

const deleteItemFromUserInventory = async (id: number) => {
  const [item] = await sql<Pick<UserInventoryRow, "user_id">[]>`
    SELECT user_id FROM user_inventory WHERE id = ${id}
  `;

  if (!item) {
    throw new Error("Failed to delete item from user inventory");
  }

  await ensureCanEditUserData(item.user_id, "inventoryEditEnabled");

  let data: UserInventoryRow | undefined;
  try {
    [data] = await sql<UserInventoryRow[]>`
      DELETE FROM user_inventory WHERE id = ${id} RETURNING *
    `;
  } catch {
    throw new Error("Failed to delete item from user inventory");
  }

  if (!data) {
    throw new Error("Failed to delete item from user inventory");
  }

  return data;
};

export default deleteItemFromUserInventory;
