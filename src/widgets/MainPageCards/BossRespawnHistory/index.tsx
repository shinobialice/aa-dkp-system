"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button, Card } from "@/shared/ui";
import RecentKills from "./RecentKills";
import RespawnHistoryDialog from "./RespawnHistoryDialog";
import { useRespawnHistory } from "./useRespawnHistory";

const RECENT_SIZE = 4;

export default function BossRespawnHistory() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { rows, total, loading } = useRespawnHistory(1, RECENT_SIZE);

  return (
    <Card className="min-w-0 gap-0 py-0">
      <div className="flex items-center justify-between gap-2 border-b px-4 py-3.5">
        <h2 className="font-semibold">Последние отметки</h2>
        <Button
          variant="link"
          className="h-auto p-0 text-green-700 dark:text-green-400"
          onClick={() => setDialogOpen(true)}
        >
          Вся история · {total}
          <ChevronRight />
        </Button>
      </div>
      <RecentKills rows={rows} loading={loading} skeletonCount={RECENT_SIZE} />
      <RespawnHistoryDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Card>
  );
}
