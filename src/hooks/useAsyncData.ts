"use client";

import { useEffect, useEffectEvent, useState } from "react";

type Result<T> = { key: string; data?: T; error?: unknown };

export function useAsyncData<T>(key: string | null, load: () => Promise<T>) {
  const [result, setResult] = useState<Result<T> | null>(null);
  const runLoad = useEffectEvent(load);

  useEffect(() => {
    if (key === null) return;
    let cancelled = false;
    runLoad().then(
      (data) => {
        if (!cancelled) setResult({ key, data });
      },
      (error: unknown) => {
        if (!cancelled) setResult({ key, error });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = async () => {
    if (key === null) return;
    try {
      const data = await load();
      setResult({ key, data });
    } catch (error) {
      setResult((current) => ({
        key,
        data: current?.key === key ? current.data : undefined,
        error,
      }));
    }
  };

  const current = result?.key === key ? result : null;

  return {
    data: current?.data,
    error: current?.error,
    isLoading: key !== null && result?.key !== key,
    reload,
  };
}
