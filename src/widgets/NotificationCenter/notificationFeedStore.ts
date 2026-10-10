"use client";

import {
  getNotificationFeed,
  type NotificationFeed,
} from "@/actions/notifications";
import { createLiveStore } from "@/hooks/createLiveStore";

const EMPTY_FEED: NotificationFeed = { lootRequests: [], notifications: [] };

export const notificationFeedStore = createLiveStore<NotificationFeed>(
  () => getNotificationFeed(),
  ["lootRequests", "notifications"],
  EMPTY_FEED,
);
