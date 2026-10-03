"use client";

import { useEffect } from "react";
import { updateLastSeen } from "@/actions/updateLastSeen";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";

const HEARTBEAT_INTERVAL_MS = 30 * 1000;

export function HeartbeatTracker() {
  useEffect(() => {
    updateLastSeen();
  }, []);

  useVisiblePolling(updateLastSeen, HEARTBEAT_INTERVAL_MS);

  return null;
}
