import type { ReactNode } from "react";
import { BellOff, Trash2 } from "lucide-react";
import type { PendingLootQueueRequest } from "@/actions/lootQueueRequestReview";
import type { UserNotification } from "@/actions/notifications";
import LootRequestCard from "./LootRequestCard";
import NotificationItem from "./NotificationItem";

type Props = {
  lootRequests: PendingLootQueueRequest[];
  notifications: UserNotification[];
  freshIds: number[];
  onNavigate: () => void;
  onClear: () => void;
};

export default function NotificationsPanel({
  lootRequests,
  notifications,
  freshIds,
  onNavigate,
  onClear,
}: Props) {
  const isEmpty = lootRequests.length === 0 && notifications.length === 0;

  return (
    <>
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b pr-2 pl-4">
        <h2 className="text-sm font-bold">Уведомления</h2>
        {notifications.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Trash2 className="size-3.5" />
            Очистить
          </button>
        )}
      </div>
      {isEmpty && (
        <p className="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted-foreground">
          <BellOff className="size-5" />
          Уведомлений пока нет
        </p>
      )}
      {!isEmpty && (
        <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-width:thin]">
          {lootRequests.length > 0 && (
            <section>
              <SectionTitle>
                Заявки в очередь · {lootRequests.length}
              </SectionTitle>
              <ul className="divide-y">
                {lootRequests.map((request) => (
                  <LootRequestCard key={request.id} request={request} />
                ))}
              </ul>
            </section>
          )}
          {notifications.length > 0 && (
            <section>
              {lootRequests.length > 0 && (
                <SectionTitle>Мои уведомления</SectionTitle>
              )}
              <ul className="divide-y">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    isFresh={
                      !notification.isRead || freshIds.includes(notification.id)
                    }
                    onNavigate={onNavigate}
                  />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3 className="sticky top-0 z-10 border-b bg-muted px-4 py-1.5 text-xs font-semibold text-muted-foreground">
      {children}
    </h3>
  );
}
