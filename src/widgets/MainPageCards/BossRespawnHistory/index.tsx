"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import RespawnHistoryDialog from "./RespawnHistoryDialog";
import { useRespawnHistory } from "./useRespawnHistory";

const TOTAL_ONLY = 1;

export default function BossRespawnHistory() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { total } = useRespawnHistory(1, TOTAL_ONLY);

  return (
    <>
      <button
        type="button"
        onClick={() => setDialogOpen(true)}
        className="inline-flex cursor-pointer items-center gap-0.5 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
      >
        История отметок · {total}
        <ChevronRight className="size-4" />
      </button>
      <RespawnHistoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
