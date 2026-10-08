"use server";

import type { TransactionSql } from "postgres";
import {
  ensureOwnCharacter,
  requirePromoQuestUser,
} from "@/server/promoQuests";
import sql from "@/shared/lib/db";
import { isGameServer } from "@/shared/config/gameServers";
import type { PromoCharacterRow } from "@/shared/lib/dbTypes";
import { MAX_CHARACTER_NAME_LENGTH } from "@/widgets/PromoQuests/promoQuestsModel";

export type PromoCharacterInput = {
  name: string;
  server: string;
  partnerId: number | null;
};

type Partner = Pick<PromoCharacterRow, "id" | "group_id">;

const MAX_CHARACTERS = 10;

export async function createPromoCharacter(input: PromoCharacterInput) {
  const { userId } = await requirePromoQuestUser();
  const name = normalizeName(input.name);
  const server = ensureServer(input.server);
  const partner = await findPartner(userId, input.partnerId);

  const [{ count }] = await sql<{ count: number }[]>`
    SELECT count(*)::int AS count FROM promo_character
    WHERE user_id = ${userId}
  `;
  if (count >= MAX_CHARACTERS) {
    throw new Error(`Можно добавить не больше ${MAX_CHARACTERS} персонажей`);
  }

  try {
    await sql.begin(async (tx) => {
      const [created] = await tx<Pick<PromoCharacterRow, "id">[]>`
        INSERT INTO promo_character (user_id, name, server, position)
        VALUES (${userId}, ${name}, ${server}, ${count})
        RETURNING id
      `;
      if (partner) await linkToPartner(tx, created.id, partner);
    });
  } catch (error) {
    console.error("Ошибка при добавлении персонажа ивента:", error);
    throw new Error("Не удалось добавить персонажа");
  }
}

export async function updatePromoCharacter(
  characterId: number,
  input: PromoCharacterInput,
) {
  const { userId } = await requirePromoQuestUser();
  const name = normalizeName(input.name);
  const server = ensureServer(input.server);
  if (input.partnerId === characterId) {
    throw new Error("Персонажа нельзя связать с самим собой");
  }
  await ensureOwnCharacter(userId, characterId);
  const partner = await findPartner(userId, input.partnerId);

  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE promo_character
        SET name = ${name}, server = ${server}, group_id = NULL
        WHERE id = ${characterId}
      `;
      if (partner) await linkToPartner(tx, characterId, partner);
      await clearLonelyGroups(tx, userId);
    });
  } catch (error) {
    console.error("Ошибка при изменении персонажа ивента:", error);
    throw new Error("Не удалось сохранить персонажа");
  }
}

export async function deletePromoCharacter(characterId: number) {
  const { userId } = await requirePromoQuestUser();
  await ensureOwnCharacter(userId, characterId);

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM promo_character WHERE id = ${characterId}`;
      await clearLonelyGroups(tx, userId);
    });
  } catch (error) {
    console.error("Ошибка при удалении персонажа ивента:", error);
    throw new Error("Не удалось удалить персонажа");
  }
}

function normalizeName(value: string) {
  const name = value.trim();
  if (!name) throw new Error("Укажите имя персонажа");
  if (name.length > MAX_CHARACTER_NAME_LENGTH) {
    throw new Error(`Имя длиннее ${MAX_CHARACTER_NAME_LENGTH} символов`);
  }
  return name;
}

function ensureServer(server: string) {
  if (!isGameServer(server)) throw new Error("Выберите сервер");
  return server;
}

async function findPartner(userId: number, partnerId: number | null) {
  if (partnerId === null) return null;
  return ensureOwnCharacter(userId, partnerId);
}

async function linkToPartner(
  tx: TransactionSql,
  characterId: number,
  partner: Partner,
) {
  let groupId = partner.group_id;
  if (groupId === null) {
    const [next] = await tx<{ id: number }[]>`
      SELECT nextval('promo_character_group_seq')::int AS id
    `;
    groupId = next.id;
  }
  await tx`
    UPDATE promo_character SET group_id = ${groupId}
    WHERE id IN (${characterId}, ${partner.id})
  `;
}

async function clearLonelyGroups(tx: TransactionSql, userId: number) {
  await tx`
    UPDATE promo_character SET group_id = NULL
    WHERE user_id = ${userId} AND group_id IN (
      SELECT group_id FROM promo_character
      WHERE user_id = ${userId} AND group_id IS NOT NULL
      GROUP BY group_id
      HAVING count(*) = 1
    )
  `;
}
