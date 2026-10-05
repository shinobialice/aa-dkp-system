"use server";
import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import { publishChanges } from "@/server/liveChanges";
import type { UserRow } from "@/shared/lib/dbTypes";
import { hasTag } from "./hasTag";
import { getSessionUserId } from "./getSessionUserId";
import {
  getUserSelfEditSettings,
  type UserSelfEditSettings,
} from "./userSelfEditSettings";

type EditableUser = Pick<
  UserRow,
  | "username"
  | "class"
  | "class_gear_score"
  | "secondary_class"
  | "secondary_class_gear_score"
  | "tertiary_class"
  | "tertiary_class_gear_score"
  | "vk_name"
  | "joined_at"
  | "active"
>;

type RoleInput = {
  className: string | null;
  gearScore: number | null;
};

const editUser = async (
  userId: number,
  username: string,
  className: string | null,
  classGearScore: number | null,
  secondaryClassName: string | null,
  secondaryClassGearScore: number | null,
  tertiaryClassName: string | null,
  tertiaryClassGearScore: number | null,
  vkName: string | null,
  joined_at: Date | string | null,
) => {
  const [existing] = await sql<EditableUser[]>`
    SELECT username, class, class_gear_score, secondary_class,
           secondary_class_gear_score, tertiary_class,
           tertiary_class_gear_score, vk_name, joined_at, active
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

    const settings = await getUserSelfEditSettings();
    assertSelfEditAllowed(existing, settings, username, [
      { className, gearScore: classGearScore },
      { className: secondaryClassName, gearScore: secondaryClassGearScore },
      { className: tertiaryClassName, gearScore: tertiaryClassGearScore },
    ]);

    // Для самоправки эти поля берутся из БД, а не от клиента: присланный
    // снимок мог устареть и ложно блокировать смену ника/ГС.
    finalVkName = settings.vkEditEnabled ? vkName : existing.vk_name;
    finalJoinedAt = existing.joined_at;
  }

  let user: { id: number } | undefined;
  try {
    [user] = await sql<{ id: number }[]>`
      UPDATE "user" SET
        username = ${username},
        class = ${className},
        class_gear_score = ${classGearScore},
        secondary_class = ${secondaryClassName},
        secondary_class_gear_score = ${secondaryClassGearScore},
        tertiary_class = ${tertiaryClassName},
        tertiary_class_gear_score = ${tertiaryClassGearScore},
        vk_name = ${finalVkName},
        joined_at = ${finalJoinedAt},
        probation_salary_granted = CASE
          WHEN joined_at::date IS DISTINCT FROM ${finalJoinedAt}::timestamptz::date THEN false
          ELSE probation_salary_granted
        END
      WHERE id = ${userId}
      RETURNING id
    `;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw new Error("Ошибка при обновлении игрока");
  }

  if (!user) {
    console.error("Failed to update user: not found");
    throw new Error("Ошибка при обновлении игрока");
  }
  await publishChanges("members");

  if (existing.username !== username) {
    try {
      await sql`
        INSERT INTO user_username_history (user_id, old_username, new_username)
        VALUES (${userId}, ${existing.username}, ${username})
      `;
    } catch (historyError) {
      console.error("Failed to log username change:", historyError);
    }
  }
};

export default editUser;

function assertSelfEditAllowed(
  existing: EditableUser,
  settings: UserSelfEditSettings,
  username: string,
  [primary, secondary, tertiary]: RoleInput[],
) {
  const primaryChange = diffRole(primary, {
    className: existing.class,
    gearScore: existing.class_gear_score,
  });
  const secondaryChange = diffRole(secondary, {
    className: existing.secondary_class,
    gearScore: existing.secondary_class_gear_score,
  });
  const tertiaryChange = diffRole(tertiary, {
    className: existing.tertiary_class,
    gearScore: existing.tertiary_class_gear_score,
  });
  const extraChanges = [secondaryChange, tertiaryChange];

  const gsChanged =
    primaryChange.changed ||
    extraChanges.some((change) => change.changed && !change.isNewAddition);
  const addingExtraRole = extraChanges.some((change) => change.isNewAddition);

  if (username !== existing.username && !settings.nicknameEditEnabled) {
    throw new Error("Access denied: nickname edit disabled");
  }
  if (gsChanged && !settings.gsEditEnabled) {
    throw new Error("Access denied: gs edit disabled");
  }
  if (addingExtraRole && !settings.extraRoleEditEnabled) {
    throw new Error("Access denied: extra role edit disabled");
  }
}

function diffRole(next: RoleInput, previous: RoleInput) {
  const changed =
    toText(next.className) !== toText(previous.className) ||
    toGearScore(next.gearScore) !== toGearScore(previous.gearScore);
  const wasEmpty = !previous.className && previous.gearScore == null;
  return { changed, isNewAddition: changed && wasEmpty && !!next.className };
}

function toGearScore(value: unknown) {
  return value == null || value === "" ? null : Number(value);
}

function toText(value: unknown) {
  return value == null || value === "" ? null : String(value);
}
