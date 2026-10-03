"use client";

import { useState } from "react";

// Диалог закрывается с анимацией: на время неё содержимое должно показывать
// последнее значение, а не мигать пустым, когда родитель уже обнулил его.
export function useRetainedValue<T>(value: T | null): T | null {
  const [retained, setRetained] = useState(value);
  if (value !== null && value !== retained) setRetained(value);
  return value ?? retained;
}
