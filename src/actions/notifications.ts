"use server";

import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import type { NotificationRow } from "@/shared/lib/dbTypes";
import type { NotificationKind } from "@/shared/config/notifications";
import { hasTag } from "./hasTag";
import { getSessionUserId } from "./getSessionUserId";
import {
  getPendingLootQueueRequests,
  type PendingLootQueueRequest,
} from "./lootQueueRequestReview";

const FEED_LIMIT = 30;

export type UserNotification = {
  id: number;
  kind: NotificationKind;
  message: string;
  link: string | null;
  createdAt: string;
  isRead: boolean;
};

export type NotificationFeed = {
  lootRequests: PendingLootQueueRequest[];
  notifications: UserNotification[];
};

type FeedRow = Pick<
  NotificationRow,
  "id" | "message" | "link" | "created_at" | "read_at"
> & { kind: NotificationKind };

export async function getNotificationFeed(): Promise<NotificationFeed> {
  const userId = await getSessionUserId();
  if (userId === null) return { lootRequests: [], notifications: [] };

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const [lootRequests, rows] = await Promise.all([
    isAdmin ? getPendingLootQueueRequests() : [],
    sql<FeedRow[]>`
      SELECT id, kind, message, link, created_at, read_at
      FROM notification
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT ${FEED_LIMIT}
    `,
  ]);

  return {
    lootRequests,
    notifications: rows.map((row) => ({
      id: row.id,
      kind: row.kind,
      message: row.message,
      link: row.link,
      createdAt: row.created_at,
      isRead: row.read_at !== null,
    })),
  };
}

export async function clearNotifications() {
  const userId = await getSessionUserId();
  if (userId === null) return;
  await sql`DELETE FROM notification WHERE user_id = ${userId}`;
}

export async function markNotificationsRead() {
  const userId = await getSessionUserId();
  if (userId === null) return;
  await sql`
    UPDATE notification SET read_at = now()
    WHERE user_id = ${userId} AND read_at IS NULL
  `;
}
