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

  // Не бьём пульс, пока вкладка в фоне — пользователь всё равно не "здесь",
  // а last_seen естественно устареет и он пропадёт из списка онлайн.
  useVisiblePolling(() => {
    if (!user) return;
    updateLastSeen(user.id);
  }, HEARTBEAT_INTERVAL_MS);

  return null;
}
