"use client";

import { useEffect } from "react";
import useCurrentUser from "@/hooks/useCurrentUser";
import { updateLastSeen } from "@/actions/updateLastSeen";

const HEARTBEAT_INTERVAL_MS = 30 * 1000;

export function HeartbeatTracker() {
  const user = useCurrentUser();

  useEffect(() => {
    if (!user) return;

    updateLastSeen(user.id);
    const interval = setInterval(() => {
      updateLastSeen(user.id);
    }, HEARTBEAT_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [user]);

  return null;
}
