"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "eventSoundNotificationsEnabled";
const CHANGE_EVENT = "sound-notifications-setting-change";

export function useSoundNotificationsEnabled() {
  const enabled = useSyncExternalStore(subscribe, readSetting, () => true);

  const setSoundEnabled = useCallback((value: boolean) => {
    window.localStorage.setItem(STORAGE_KEY, String(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { enabled, setSoundEnabled };
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readSetting(): boolean {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null || stored === "true";
}
