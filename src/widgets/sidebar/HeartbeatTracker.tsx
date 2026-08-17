"use client";

import { useEffect } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { updateLastSeen } from "@/actions/updateLastSeen";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";

const HEARTBEAT_INTERVAL_MS = 30 * 1000;

export function HeartbeatTracker() {
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;
    updateLastSeen(user.id);
  }, [user]);

  useVisiblePolling(() => {
    if (!user) return;
    updateLastSeen(user.id);
  }, HEARTBEAT_INTERVAL_MS);

  return null;
}
