"use server";
import { randomBytes } from "node:crypto";
import sql from "@/shared/lib/db";
import type { CalculatorShareRow, UserRow } from "@/shared/lib/dbTypes";
import { selectBuildOwners } from "@/server/calculatorOwners";
import {
  parseCalculatorSnapshot,
  validateCalculatorSnapshot,
} from "@/server/calculatorSnapshot";
import type { CalculatorSnapshot } from "@/widgets/calculator/buildSnapshot";
import type { BuildOwner } from "@/widgets/calculator/calculatorModel";
import { getSessionUserId } from "./getSessionUserId";

export type CalculatorShare = {
  id: string;
  snapshot: CalculatorSnapshot;
  owners: BuildOwner[];
  authorName: string;
  createdAt: string;
};

type ShareRow = Pick<CalculatorShareRow, "builds" | "created_at"> &
  Pick<UserRow, "username">;

const SHARE_ID_ALPHABET =
  "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
const SHARE_ID_LENGTH = 8;
const SHARE_ID_PATTERN = /^[A-Za-z0-9]{8}$/;

export async function createCalculatorShare(
  snapshot: CalculatorSnapshot,
): Promise<string> {
  const authorId = await getSessionUserId();
  if (authorId === null) throw new Error("Нужно войти на сайт");

  const { builds } = validateCalculatorSnapshot(snapshot);
  const id = randomShareId();
  try {
    await sql`
      INSERT INTO calculator_share (id, author_id, builds)
      VALUES (${id}, ${authorId}, ${sql.json(builds)})
    `;
  } catch (error) {
    console.error("Ошибка при создании ссылки на сборку:", error);
    throw new Error("Не удалось создать ссылку");
  }
  return id;
}

export async function getCalculatorShare(
  id: string,
): Promise<CalculatorShare | null> {
  const viewerId = await getSessionUserId();
  if (viewerId === null) throw new Error("Нужно войти на сайт");
  if (!SHARE_ID_PATTERN.test(id)) return null;

  const [share] = await selectShare(id);
  if (!share) return null;
  const snapshot = parseCalculatorSnapshot({ builds: share.builds });
  return {
    id,
    snapshot,
    owners: await selectBuildOwners(snapshot.builds),
    authorName: share.username,
    createdAt: share.created_at,
  };
}

async function selectShare(id: string) {
  try {
    return await sql<ShareRow[]>`
      SELECT s.builds, s.created_at, u.username
      FROM calculator_share s
      JOIN "user" u ON u.id = s.author_id
      WHERE s.id = ${id}
    `;
  } catch (error) {
    console.error("Ошибка при загрузке сборки по ссылке:", error);
    throw new Error("Не удалось открыть сборку по ссылке");
  }
}

function randomShareId(): string {
  return Array.from(
    randomBytes(SHARE_ID_LENGTH),
    (byte) => SHARE_ID_ALPHABET[byte % SHARE_ID_ALPHABET.length],
  ).join("");
}
