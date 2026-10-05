"use client";

import { useEffect, useEffectEvent } from "react";
import { LIVE_TOPICS, type LiveTopic } from "@/shared/config/liveTopics";

type Subscriber = {
  topics: string[];
  onChange: () => void;
  isStale: boolean;
};

const LIVE_URL = "/api/live";
const MIN_RECONNECT_MS = 5_000;
const MAX_RECONNECT_MS = 60_000;

const subscribers = new Set<Subscriber>();
let isStarted = false;
let hasConnected = false;
let reconnectDelay = MIN_RECONNECT_MS;

export function subscribeToLiveChanges(
  topics: readonly LiveTopic[],
  onChange: () => void,
) {
  const subscriber = { topics: [...topics], onChange, isStale: false };
  subscribers.add(subscriber);
  if (!isStarted) {
    isStarted = true;
    document.addEventListener("visibilitychange", refreshStale);
    connect();
  }
  return () => {
    subscribers.delete(subscriber);
  };
}

export function useLiveChanges(
  topics: readonly LiveTopic[],
  onChange: () => void,
) {
  const handleChange = useEffectEvent(onChange);
  const topicsKey = topics.join(",");

  useEffect(() => {
    const subscribedTopics = LIVE_TOPICS.filter((topic) =>
      topicsKey.split(",").includes(topic),
    );
    return subscribeToLiveChanges(subscribedTopics, () => handleChange());
  }, [topicsKey]);
}

function connect() {
  const source = new EventSource(LIVE_URL);

  source.onopen = () => {
    reconnectDelay = MIN_RECONNECT_MS;
    if (hasConnected) markChanged(LIVE_TOPICS);
    hasConnected = true;
  };

  source.onmessage = (event: MessageEvent<string>) => {
    markChanged(event.data.split(","));
  };

  // Сам EventSource переподключается только после обрыва сети. Ответ 502 во
  // время деплоя закрывает его насовсем, поэтому переподключаемся вручную.
  source.onerror = () => {
    if (source.readyState !== EventSource.CLOSED) return;
    setTimeout(connect, reconnectDelay);
    reconnectDelay = Math.min(reconnectDelay * 2, MAX_RECONNECT_MS);
  };
}

function markChanged(topics: readonly string[]) {
  for (const subscriber of subscribers) {
    if (!subscriber.topics.some((topic) => topics.includes(topic))) continue;
    if (document.hidden) {
      subscriber.isStale = true;
    } else {
      subscriber.onChange();
    }
  }
}

function refreshStale() {
  if (document.hidden) return;
  for (const subscriber of subscribers) {
    if (!subscriber.isStale) continue;
    subscriber.isStale = false;
    subscriber.onChange();
  }
}
