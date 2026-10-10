"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setViewAsRegular } from "@/actions/viewAsRegular";

export function useViewAsPlayer(initial: boolean) {
  const router = useRouter();
  const [checked, setChecked] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const toggle = (next: boolean) => {
    setChecked(next);
    startTransition(async () => {
      await setViewAsRegular(next);
      router.refresh();
    });
  };
  return { checked, isPending, toggle };
}
