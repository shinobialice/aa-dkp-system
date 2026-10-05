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
let lastEventId: string | null = null;
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

// Пропущенное за время обрыва сервер досылает сам по номеру последнего
// события: браузер передаёт его в Last-Event-ID, а при ручном
// переподключении — мы в параметре запроса.
function connect() {
  const url = lastEventId
    ? `${LIVE_URL}?lastEventId=${encodeURIComponent(lastEventId)}`
    : LIVE_URL;
  const source = new EventSource(url);

  source.onopen = () => {
    reconnectDelay = MIN_RECONNECT_MS;
  };

  source.addEventListener("hello", (event: MessageEvent<string>) => {
    lastEventId = event.lastEventId;
  });

  source.onmessage = (event: MessageEvent<string>) => {
    lastEventId = event.lastEventId;
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
