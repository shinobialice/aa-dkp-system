"use server";
import sql from "@/shared/lib/db";
import type { CalculatorBuildRow } from "@/shared/lib/dbTypes";
import { selectBuildOwners } from "@/server/calculatorOwners";
import {
  parseBuildSnapshot,
  validateBuildSnapshot,
} from "@/server/calculatorSnapshot";
import type { BuildSnapshot } from "@/widgets/calculator/buildSnapshot";
import type { BuildOwner } from "@/widgets/calculator/calculatorModel";
import { getSessionUserId } from "./getSessionUserId";

export type SavedBuild = {
  id: number;
  snapshot: BuildSnapshot;
};

export type SavedBuilds = {
  builds: SavedBuild[];
  owners: BuildOwner[];
};

type SavedBuildRow = Pick<CalculatorBuildRow, "id" | "build">;

const MAX_SAVED_BUILDS = 50;

export async function getMyCalculatorBuilds(): Promise<SavedBuilds> {
  const authorId = await requireAuthorId();
  const rows = await selectSavedBuilds(authorId);
  const builds = rows.map((row) => ({
    id: row.id,
    snapshot: parseBuildSnapshot(row.build),
  }));
  return {
    builds,
    owners: await selectBuildOwners(builds.map((build) => build.snapshot)),
  };
}

export async function saveCalculatorBuild(
  id: number | null,
  snapshot: BuildSnapshot,
): Promise<number> {
  const authorId = await requireAuthorId();
  const build = validateBuildSnapshot(snapshot);
  const [saved] = await writeBuild(id, authorId, build);
  if (!saved && id !== null) throw new Error("Кукла не найдена");
  if (!saved) {
    throw new Error(`Можно сохранить не больше ${MAX_SAVED_BUILDS} кукол`);
  }
  return saved.id;
}

export async function deleteCalculatorBuild(id: number): Promise<void> {
  const authorId = await requireAuthorId();
  try {
    await sql`
      DELETE FROM calculator_build
      WHERE id = ${id} AND author_id = ${authorId}
    `;
  } catch (error) {
    console.error("Ошибка при удалении куклы:", error);
    throw new Error("Не удалось удалить куклу");
  }
}

async function requireAuthorId(): Promise<number> {
  const authorId = await getSessionUserId();
  if (authorId === null) throw new Error("Нужно войти на сайт");
  return authorId;
}

async function selectSavedBuilds(authorId: number) {
  try {
    return await sql<SavedBuildRow[]>`
      SELECT id, build
      FROM calculator_build
      WHERE author_id = ${authorId}
      ORDER BY updated_at DESC
    `;
  } catch (error) {
    console.error("Ошибка при загрузке сохранённых кукол:", error);
    throw new Error("Не удалось загрузить сохранённые куклы");
  }
}

async function writeBuild(
  id: number | null,
  authorId: number,
  build: BuildSnapshot,
) {
  try {
    if (id !== null) {
      return await sql<Pick<CalculatorBuildRow, "id">[]>`
        UPDATE calculator_build
        SET build = ${sql.json(build)}, updated_at = now()
        WHERE id = ${id} AND author_id = ${authorId}
        RETURNING id
      `;
    }
    return await sql<Pick<CalculatorBuildRow, "id">[]>`
      INSERT INTO calculator_build (author_id, build)
      SELECT ${authorId}, ${sql.json(build)}
      WHERE (
        SELECT count(*) FROM calculator_build WHERE author_id = ${authorId}
      ) < ${MAX_SAVED_BUILDS}
      RETURNING id
    `;
  } catch (error) {
    console.error("Ошибка при сохранении куклы:", error);
    throw new Error("Не удалось сохранить куклу");
  }
}
