"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "eventSoundNotificationsEnabled";
const CHANGE_EVENT = "sound-notifications-setting-change";

function readSetting(): boolean {
  if (typeof window === "undefined") return true;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "true";
}

export function useSoundNotificationsEnabled() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(readSetting());

    const handleChange = () => setEnabled(readSetting());
    window.addEventListener(CHANGE_EVENT, handleChange);
    window.addEventListener("storage", handleChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, handleChange);
      window.removeEventListener("storage", handleChange);
    };
  }, []);

  const setSoundEnabled = useCallback((value: boolean) => {
    window.localStorage.setItem(STORAGE_KEY, String(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { enabled, setSoundEnabled };
}
