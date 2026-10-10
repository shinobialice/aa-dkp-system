import "server-only";
import type { TransactionSql } from "postgres";
import type { NotificationKind } from "@/shared/config/notifications";

type Notice = {
  userId: number;
  kind: NotificationKind;
  message: string;
  link: string | null;
};

export async function notifyUser(tx: TransactionSql, notice: Notice) {
  await tx`
    INSERT INTO notification (user_id, kind, message, link)
    VALUES (${notice.userId}, ${notice.kind}, ${notice.message}, ${notice.link})
  `;
}
