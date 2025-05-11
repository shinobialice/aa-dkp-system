"use client";
import { useEffect, useState } from "react";

function useUserTag(tag: string) {
  const [hasTag, setHasTag] = useState<boolean>(false);

  useEffect(() => {
    const checkTag = async () => {
      try {
        const res = await fetch(
          `/api/user/has-tag?tag=${encodeURIComponent(tag)}`,
          { credentials: "include" } // 👈 добавь это
        );
        if (!res.ok) return;
        const json = await res.json();
        setHasTag(json.hasTag === true);
      } catch {
        // ignore
      }
    };
    checkTag();
  }, [tag]);

  return hasTag;
}

export default useUserTag;
