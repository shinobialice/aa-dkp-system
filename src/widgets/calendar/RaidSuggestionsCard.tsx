"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Swords, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import {
  getPendingRaidSuggestions,
  approveRaidSuggestion,
  dismissRaidSuggestion,
  type RaidSuggestion,
} from "@/actions/raidSuggestions";

function formatMoscowDateTime(iso: string): string {
  return new Date(iso).toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function RaidSuggestionsCard({
  onRaidCreated,
}: {
  onRaidCreated?: () => void;
}) {
  const [suggestions, setSuggestions] = useState<RaidSuggestion[]>([]);
  const [pending, setPending] = useState<string | null>(null);

  const reload = useCallback(() => {
    getPendingRaidSuggestions().then(setSuggestions).catch(() => {});
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  useVisiblePolling(reload, 30_000);

  const handleApprove = async (bossName: RaidSuggestion["bossName"]) => {
    setPending(bossName);
    try {
      await approveRaidSuggestion(bossName);
      toast.success(`Рейд по «${bossName}» создан`);
      setSuggestions((prev) => prev.filter((s) => s.bossName !== bossName));
      onRaidCreated?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось создать рейд",
      );
    } finally {
      setPending(null);
    }
  };

  const handleDismiss = async (bossName: RaidSuggestion["bossName"]) => {
    setPending(bossName);
    try {
      await dismissRaidSuggestion(bossName);
      setSuggestions((prev) => prev.filter((s) => s.bossName !== bossName));
    } catch {
      toast.error("Не удалось убрать подсказку");
    } finally {
      setPending(null);
    }
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="mb-1.5 flex items-center gap-1.5 px-2">
        <Swords className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Создать рейд?
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        {suggestions.map((s) => (
          <div
            key={s.bossName}
            className="flex items-center justify-between gap-2 rounded-md border px-2 py-1.5 text-sm"
          >
            <div className="min-w-0">
              <div className="font-medium">{s.bossName}</div>
              <div className="text-xs text-muted-foreground">
                {formatMoscowDateTime(s.killTime)}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <Button
                size="icon-sm"
                variant="outline"
                className="cursor-pointer text-green-600 hover:text-green-600"
                disabled={pending === s.bossName}
                onClick={() => handleApprove(s.bossName)}
                title="Создать рейд"
              >
                <Check className="size-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="outline"
                className="cursor-pointer text-destructive hover:text-destructive"
                disabled={pending === s.bossName}
                onClick={() => handleDismiss(s.bossName)}
                title="Не нужно"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
