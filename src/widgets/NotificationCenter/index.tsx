"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  clearNotifications,
  markNotificationsRead,
} from "@/actions/notifications";
import BellButton from "./BellButton";
import NotificationsPanel from "./NotificationsPanel";
import { notificationFeedStore } from "./notificationFeedStore";

type Props = {
  isAdmin: boolean;
};

export default function NotificationCenter({ isAdmin }: Props) {
  const feed = notificationFeedStore.use();
  const [isOpen, setIsOpen] = useState(false);
  const [freshIds, setFreshIds] = useState<number[]>([]);
  const previousIsAdmin = useRef(isAdmin);
  const lootRequests = isAdmin ? feed.lootRequests : [];
  const unreadIds = feed.notifications
    .filter((notification) => !notification.isRead)
    .map((notification) => notification.id);

  useEffect(() => {
    if (previousIsAdmin.current === isAdmin) return;
    previousIsAdmin.current = isAdmin;
    notificationFeedStore.refresh();
  }, [isAdmin]);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);
    if (!open) return;
    setFreshIds(unreadIds);
    if (unreadIds.length === 0) return;
    try {
      await markNotificationsRead();
      await notificationFeedStore.refresh();
    } catch (error) {
      toast.error(
        errorMessage(error, "Не удалось отметить уведомления прочитанными"),
      );
    }
  };

  const handleClear = async () => {
    try {
      await clearNotifications();
      await notificationFeedStore.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось очистить уведомления"));
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <BellButton count={lootRequests.length + unreadIds.length} />
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        collisionPadding={16}
        className="flex max-h-[min(34rem,var(--radix-popover-content-available-height))] w-[min(24rem,calc(100vw-2rem))] flex-col p-0"
      >
        <NotificationsPanel
          lootRequests={lootRequests}
          notifications={feed.notifications}
          freshIds={freshIds}
          onNavigate={() => setIsOpen(false)}
          onClear={handleClear}
        />
      </PopoverContent>
    </Popover>
  );
}
