"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";

const deleteItemFromUserInventory = async (id: number) => {
  const [item] = await sql<any[]>`
    SELECT user_id FROM user_inventory WHERE id = ${id}
  `;

  if (!item) {
    throw new Error("Failed to delete item from user inventory");
  }

  await ensureCanEditUserData(item.user_id, "inventoryEditEnabled");

  let data;
  try {
    [data] = await sql<any[]>`
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
