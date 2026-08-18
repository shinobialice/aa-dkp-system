"use server";
import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import { hasTag } from "./hasTag";
import { getSessionUserId } from "./getSessionUserId";
import { getUserSelfEditSettings } from "./userSelfEditSettings";

const editUser = async (
  userId: number,
  username: string,
  className: string,
  classGearScore: number,
  secondaryClassName: string | null,
  secondaryClassGearScore: number | null,
  vkName: string,
  joined_at: Date | string | null,
) => {
  const [existing] = await sql<any[]>`
    SELECT username, class, class_gear_score, secondary_class,
           secondary_class_gear_score, vk_name, joined_at, active
    FROM "user"
    WHERE id = ${userId}
  `;

  if (!existing) {
    throw new Error("Игрок не найден");
  }

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isPrivilegedEditor = await hasTag(sessionToken, [
    "Администратор",
    "Секретутка",
  ]);

  // Поля, которые самоправщик физически не видит в форме (vkName, joined_at).
  // Раньше сервер сравнивал присланное значение с текущим в БД и отклонял
  // правку при расхождении — но эти два снимка могут разъехаться по любой
  // причине, не связанной с действием пользователя (админ поправил дату,
  // вкладка провисела открытой и т.п.), и тогда обычная смена ника/ГС ложно
  // блокировалась. Проще и надёжнее для не-админов не доверять клиенту эти
  // поля вовсе, а всегда сохранять то, что уже есть в БД.
  let finalVkName = vkName;
  let finalJoinedAt = joined_at ? new Date(joined_at).toISOString() : null;

  if (!isPrivilegedEditor) {
    const sessionUserId = await getSessionUserId();
    if (sessionUserId !== userId) {
      throw new Error("Access denied: not own profile");
    }
    if (!existing.active) {
      throw new Error("Access denied: profile not active");
    }

    finalVkName = existing.vk_name;
    finalJoinedAt = existing.joined_at;

    const nicknameChanged = username !== existing.username;
    const gsChanged =
      className !== existing.class ||
      classGearScore !== existing.class_gear_score ||
      secondaryClassName !== existing.secondary_class ||
      secondaryClassGearScore !== existing.secondary_class_gear_score;

    const selfEditSettings = await getUserSelfEditSettings();
    if (nicknameChanged && !selfEditSettings.nicknameEditEnabled) {
      throw new Error("Access denied: nickname edit disabled");
    }
    if (gsChanged && !selfEditSettings.gsEditEnabled) {
      throw new Error("Access denied: gs edit disabled");
    }
  }

  let user;
  try {
    [user] = await sql<any[]>`
      UPDATE "user" SET
        username = ${username},
        class = ${className},
        class_gear_score = ${classGearScore},
        secondary_class = ${secondaryClassName},
        secondary_class_gear_score = ${secondaryClassGearScore},
        vk_name = ${finalVkName},
        joined_at = ${finalJoinedAt}
      WHERE id = ${userId}
      RETURNING *
    `;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Ошибка при обновлении игрока");
  }

  if (!user) {
    console.error("Failed to update user: not found");
    throw new Error("Ошибка при обновлении игрока");
  }

  if (existing?.username && existing.username !== username) {
    try {
      await sql<any[]>`
        INSERT INTO user_username_history (user_id, old_username, new_username)
        VALUES (${userId}, ${existing.username}, ${username})
      `;
    } catch (historyError) {
      console.error("Failed to log username change:", historyError);
    }
  }

  return user;
};

export default editUser;
