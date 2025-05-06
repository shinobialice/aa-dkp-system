"use client";
import { useEffect, useState } from "react";

export function useUserTag(tag: string) {
  const [hasTag, setHasTag] = useState<boolean>(false);

  useEffect(() => {
    const checkTag = async () => {
      try {
        const res = await fetch(
          `/api/user/has-tag?tag=${encodeURIComponent(tag)}`
        );
        const json = await res.json();
        setHasTag(json.hasTag === true);
      } catch (err) {
        console.error("Ошибка при получении тега:", err);
      }
    };
    checkTag();
  }, [tag]);

  return hasTag;
}
