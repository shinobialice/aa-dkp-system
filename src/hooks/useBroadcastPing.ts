"use client";

import { useEffect, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/shared/lib/supabase";
import { realtimeAuthReady } from "./useRealtimeAuth";
import { useVisiblePolling } from "./useVisiblePolling";


const SAFETY_NET_MS = 4 * 60 * 1000;

const DEBOUNCE_MS = 1200;

const listenersByTopic = new Map<string, Set<() => void>>();
const channelsByTopic = new Map<string, RealtimeChannel>();
const pendingTopics = new Set<string>();
const debounceTimersByTopic = new Map<string, ReturnType<typeof setTimeout>>();

function notifyDebounced(topic: string) {
  const existing = debounceTimersByTopic.get(topic);
  if (existing) clearTimeout(existing);
  debounceTimersByTopic.set(
    topic,
    setTimeout(() => {
      debounceTimersByTopic.delete(topic);
      listenersByTopic.get(topic)?.forEach((listener) => listener());
    }, DEBOUNCE_MS),
  );
}

async function ensureChannel(topic: string) {
  pendingTopics.add(topic);
  try {

    await realtimeAuthReady;
    if (channelsByTopic.has(topic)) return;
    if (!listenersByTopic.get(topic)?.size) return; // все отписались, пока ждали

    const channel = supabase
      .channel(topic, { config: { private: true } })
      .on("broadcast", { event: "change" }, () => notifyDebounced(topic))
      .subscribe();
    channelsByTopic.set(topic, channel);
  } finally {
    pendingTopics.delete(topic);
  }
}

function subscribe(topic: string, listener: () => void): () => void {
  let listeners = listenersByTopic.get(topic);
  if (!listeners) {
    listeners = new Set();
    listenersByTopic.set(topic, listeners);
  }
  listeners.add(listener);

  if (!channelsByTopic.has(topic) && !pendingTopics.has(topic)) {
    ensureChannel(topic);
  }

  return () => {
    listeners!.delete(listener);
    if (listeners!.size === 0) {
      listenersByTopic.delete(topic);
      const timer = debounceTimersByTopic.get(topic);
      if (timer) {
        clearTimeout(timer);
        debounceTimersByTopic.delete(topic);
      }
      const channel = channelsByTopic.get(topic);
      if (channel) {
        supabase.removeChannel(channel);
        channelsByTopic.delete(topic);
      }
    }
  };
}


export function useBroadcastPing(topic: string, refetch: () => void) {
  const refetchRef = useRef(refetch);
  useEffect(() => {
    refetchRef.current = refetch;
  });

  useEffect(() => subscribe(topic, () => refetchRef.current()), [topic]);

  useVisiblePolling(refetch, SAFETY_NET_MS);
}
