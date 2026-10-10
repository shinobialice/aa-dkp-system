"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const subscribeNoop = () => () => {};

export function useDarkTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";
  return {
    isDark,
    setDark: (dark: boolean) => setTheme(dark ? "dark" : "light"),
  };
}
