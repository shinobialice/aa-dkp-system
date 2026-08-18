"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";

const addItemToUserInventory = async (
  userId: number,
  name: string,
  type: string,
  quality: string | null,
) => {
  await ensureCanEditUserData(userId, "inventoryEditEnabled");

  try {
    const [data] = await sql<any[]>`
      INSERT INTO user_inventory (user_id, name, type, quality, created_at)
      VALUES (${userId}, ${name}, ${type}, ${quality}, now())
      RETURNING *
    `;
    return data;
  } catch (error) {
    console.error("Failed to insert inventory item:", error);
    throw new Error("Error inserting inventory item");
  }
};

export default addItemToUserInventory;
