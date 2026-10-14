"use client";

import { useCallback, useSyncExternalStore } from "react";

export type QuestView = "cards" | "table";

const STORAGE_KEY = "promoQuestView";
const CHANGE_EVENT = "promo-quest-view-change";

export function useQuestView() {
  const view = useSyncExternalStore(subscribe, readView, serverView);

  const setView = useCallback((next: QuestView) => {
    window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  }, []);

  return { view, setView };
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function readView(): QuestView {
  return window.localStorage.getItem(STORAGE_KEY) === "table"
    ? "table"
    : "cards";
}

function serverView(): QuestView {
  return "cards";
}
