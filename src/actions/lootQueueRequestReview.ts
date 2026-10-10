"use server";

import type { TransactionSql } from "postgres";
import sql from "@/shared/lib/db";
import type {
  ItemTypeRow,
  LootQueueRequestRow,
  UserRow,
} from "@/shared/lib/dbTypes";
import { v } from "@/shared/lib/valibot";
import { publishChanges } from "@/server/liveChanges";
import { LOOT_BUY_LINK } from "@/server/lootQueueNotifications";
import { notifyUser } from "@/server/notifications";
import { REJECT_REASON_MAX } from "@/widgets/NotificationCenter/notificationCenterModel";
import ensurePrivilieges from "./ensurePrivilieges";
import { getSessionUserId } from "./getSessionUserId";

const REVIEWER_TAGS = ["Администратор"];

const RejectReasonSchema = v.pipe(
  v.string(),
  v.trim(),
  v.nonEmpty("Напишите причину отказа"),
  v.maxLength(REJECT_REASON_MAX),
);

type DecidedRequest = Pick<LootQueueRequestRow, "user_id" | "item_type_id"> & {
  item_name: string;
};

export type PendingLootQueueRequest = {
  id: number;
  userId: number;
  username: string;
  avatarUrl: string | null;
  itemName: string;
  itemIcon: string | null;
  itemGrade: number;
  comment: string | null;
  createdAt: string;
};

type PendingRow = Pick<
  LootQueueRequestRow,
  "id" | "user_id" | "comment" | "created_at"
> &
  Pick<UserRow, "username" | "avatar_url"> &
  Pick<ItemTypeRow, "icon_url" | "grade"> & { item_name: string };

export async function getPendingLootQueueRequests(): Promise<
  PendingLootQueueRequest[]
> {
  await ensurePrivilieges(REVIEWER_TAGS);
  const rows = await sql<PendingRow[]>`
    SELECT
      r.id, r.user_id, r.comment, r.created_at,
      u.username, u.avatar_url,
      it.name AS item_name, it.icon_url, it.grade
    FROM loot_queue_request r
    JOIN "user" u ON u.id = r.user_id
    JOIN item_type it ON it.id = r.item_type_id
    WHERE r.status = 'pending'
    ORDER BY r.created_at
  `;
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    username: row.username,
    avatarUrl: row.avatar_url,
    itemName: row.item_name,
    itemIcon: row.icon_url,
    itemGrade: row.grade,
    comment: row.comment,
    createdAt: row.created_at,
  }));
}

export async function approveLootQueueRequest(requestId: number) {
  await ensurePrivilieges(REVIEWER_TAGS);
  const adminId = await getSessionUserId();

  await sql.begin(async (tx) => {
    const request = await decideRequest(tx, requestId, "approved", adminId);
    await tx`
      INSERT INTO loot_queue
        (user_id, item_type_id, status, required, delivered, synth_target, created_at)
      SELECT ${request.user_id}, ${request.item_type_id}, 'ожидание', 1, 0, '', now()
      WHERE NOT EXISTS (
        SELECT 1 FROM loot_queue
        WHERE user_id = ${request.user_id}
          AND item_type_id = ${request.item_type_id}
      )
    `;
    await notifyUser(tx, {
      userId: request.user_id,
      kind: "lootRequestApproved",
      message: `Вас поставили в очередь на «${request.item_name}»`,
      link: LOOT_BUY_LINK,
    });
  });

  await publishChanges("lootRequests", "notifications");
}

export async function rejectLootQueueRequest(
  requestId: number,
  reason: string,
) {
  await ensurePrivilieges(REVIEWER_TAGS);
  const rejectReason = v.parse(RejectReasonSchema, reason);
  const adminId = await getSessionUserId();

  await sql.begin(async (tx) => {
    const request = await decideRequest(tx, requestId, "rejected", adminId);
    await tx`
      UPDATE loot_queue_request
      SET reject_reason = ${rejectReason}
      WHERE id = ${requestId}
    `;
    await notifyUser(tx, {
      userId: request.user_id,
      kind: "lootRequestRejected",
      message: `Заявку в очередь на «${request.item_name}» отклонили. Причина: ${rejectReason}`,
      link: LOOT_BUY_LINK,
    });
  });

  await publishChanges("lootRequests", "notifications");
}

async function decideRequest(
  tx: TransactionSql,
  requestId: number,
  status: "approved" | "rejected",
  adminId: number | null,
) {
  const [request] = await tx<DecidedRequest[]>`
    UPDATE loot_queue_request r
    SET status = ${status}, decided_at = now(), decided_by = ${adminId}
    FROM item_type it
    WHERE r.id = ${requestId} AND r.status = 'pending' AND it.id = r.item_type_id
    RETURNING r.user_id, r.item_type_id, it.name AS item_name
  `;
  if (!request) throw new Error("Заявку уже рассмотрели или отозвали");
  return request;
}
