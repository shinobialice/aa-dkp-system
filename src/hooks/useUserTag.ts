"use client";
import { useEffect, useState } from "react";

function useUserTag(tag: string) {
  const [hasTag, setHasTag] = useState<boolean>(false);

  useEffect(() => {
    const checkTag = async () => {
      const res = await fetch(
        `/api/user/has-tag?tag=${encodeURIComponent(tag)}`
      );
      const json = await res.json();
      setHasTag(json.hasTag === true);
    };
    checkTag();
  }, [tag]);

  return hasTag;
}

export default useUserTag;
