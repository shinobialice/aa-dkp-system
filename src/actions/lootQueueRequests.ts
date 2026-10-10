"use server";

import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import type { LootQueueRequestRow } from "@/shared/lib/dbTypes";
import { getSessionUser } from "@/shared/lib/session";
import { hasPgCode, UNIQUE_VIOLATION } from "@/shared/lib/pgErrors";
import { v } from "@/shared/lib/valibot";
import { publishChanges } from "@/server/liveChanges";
import { QUEUE_REQUEST_COMMENT_MAX } from "@/widgets/Loot/LootBuy/lootBuyModel";
import { getSessionUserId } from "./getSessionUserId";

export type MyLootQueueRequest = {
  id: number;
  status: "pending" | "rejected";
  createdAt: string;
  rejectReason: string | null;
};

export type MyLootQueueRequests = Record<string, MyLootQueueRequest>;

type RequestRow = Pick<
  LootQueueRequestRow,
  "id" | "created_at" | "reject_reason"
> & {
  status: MyLootQueueRequest["status"];
};

const RequestSchema = v.object({
  itemName: v.pipe(v.string(), v.nonEmpty()),
  comment: v.pipe(v.string(), v.trim(), v.maxLength(QUEUE_REQUEST_COMMENT_MAX)),
});

export async function getMyLootQueueRequests(): Promise<MyLootQueueRequests> {
  const userId = await getSessionUserId();
  if (userId === null) return {};

  const rows = await sql<(RequestRow & { item_name: string })[]>`
    SELECT * FROM (
      SELECT DISTINCT ON (r.item_type_id)
        r.id, r.status, r.created_at, r.reject_reason, it.name AS item_name
      FROM loot_queue_request r
      JOIN item_type it ON it.id = r.item_type_id
      WHERE r.user_id = ${userId}
      ORDER BY r.item_type_id, r.created_at DESC
    ) latest
    WHERE latest.status <> 'approved'
  `;
  return Object.fromEntries(
    rows.map((row) => [row.item_name, toMyRequest(row)]),
  );
}

export async function requestLootQueue(
  itemName: string,
  comment: string,
): Promise<MyLootQueueRequest> {
  const input = v.parse(RequestSchema, { itemName, comment });
  const userId = await requireActiveUserId();

  const [item] = await sql<{ id: number }[]>`
    SELECT id FROM item_type WHERE name = ${input.itemName}
  `;
  if (!item) throw new Error("Предмет не найден");

  const [queueEntry] = await sql<{ id: number }[]>`
    SELECT id FROM loot_queue
    WHERE user_id = ${userId} AND item_type_id = ${item.id}
  `;
  if (queueEntry) throw new Error("Вы уже стоите в очереди на этот предмет");

  const [request] = await sql<RequestRow[]>`
    INSERT INTO loot_queue_request (user_id, item_type_id, comment)
    VALUES (${userId}, ${item.id}, ${input.comment || null})
    RETURNING id, status, created_at, reject_reason
  `.catch((error: unknown) => {
    if (hasPgCode(error, UNIQUE_VIOLATION)) {
      throw new Error("Заявка на этот предмет уже ждёт решения");
    }
    throw error;
  });

  await publishChanges("lootRequests");
  return toMyRequest(request);
}

export async function cancelLootQueueRequest(requestId: number) {
  const userId = await requireActiveUserId();
  const deleted = await sql`
    DELETE FROM loot_queue_request
    WHERE id = ${requestId} AND user_id = ${userId} AND status = 'pending'
  `;
  if (deleted.count === 0) {
    throw new Error("Заявку уже рассмотрели — обновите страницу");
  }
  await publishChanges("lootRequests");
}

async function requireActiveUserId() {
  const sessionToken = (await cookies()).get("session_token")?.value;
  const user = await getSessionUser(sessionToken);
  if (!user || !user.active) {
    throw new Error("Заявку может отправить только участник гильдии");
  }
  return user.id;
}

function toMyRequest(row: RequestRow): MyLootQueueRequest {
  return {
    id: row.id,
    status: row.status,
    createdAt: row.created_at,
    rejectReason: row.reject_reason,
  };
}
