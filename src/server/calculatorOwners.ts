import "server-only";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import type { BuildSnapshot } from "@/widgets/calculator/buildSnapshot";
import type { BuildOwner } from "@/widgets/calculator/calculatorModel";

type OwnerRow = Pick<UserRow, "id" | "avatar_url" | "character_portrait_url">;

export async function selectBuildOwners(
  snapshots: BuildSnapshot[],
): Promise<BuildOwner[]> {
  const ownerIds = snapshots.flatMap((snapshot) =>
    snapshot.ownerId === null ? [] : [snapshot.ownerId],
  );
  if (ownerIds.length === 0) return [];
  try {
    const rows = await sql<OwnerRow[]>`
      SELECT id, avatar_url, character_portrait_url
      FROM "user"
      WHERE id = ANY(${ownerIds})
    `;
    return rows.map((row) => ({
      id: row.id,
      avatarUrl: row.avatar_url,
      portraitUrl: row.character_portrait_url,
    }));
  } catch (error) {
    console.error("Ошибка при загрузке игроков для сборок:", error);
    throw new Error("Не удалось загрузить сборки");
  }
}
