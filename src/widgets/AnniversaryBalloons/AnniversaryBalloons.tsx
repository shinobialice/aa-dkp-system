"use client";

import { useCallback, useEffect, useState } from "react";
import { Cake } from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import {
  cheerAnniversary,
  getTodayAnniversaries,
  type TodayAnniversaries,
} from "@/actions/anniversaryActions";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import { errorMessage } from "@/shared/lib/errorMessage";
import BalloonsArt, { balloons } from "./BalloonsArt";
import { launchConfetti } from "./launchConfetti";
import AnniversaryRow from "./AnniversaryRow";

const POLL_INTERVAL_MS = 60 * 1000;

const SEEN_STORAGE_KEY = "anniversaryPopoverSeenDate";

export const NAMES_LIMIT = 5;

function shouldAutoOpen(data: TodayAnniversaries) {
  if (data.anniversaries.length === 0) return false;
  try {
    if (window.localStorage.getItem(SEEN_STORAGE_KEY) === data.date) {
      return false;
    }
    window.localStorage.setItem(SEEN_STORAGE_KEY, data.date);
    return true;
  } catch {
    return false;
  }
}

export function AnniversaryBalloons() {
  const [data, setData] = useState<TodayAnniversaries | null>(null);
  const [open, setOpen] = useState(false);

  const load = useCallback(() => {
    getTodayAnniversaries()
      .then((next) => {
        setData(next);
        if (shouldAutoOpen(next)) setOpen(true);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useVisiblePolling(load, POLL_INTERVAL_MS);

  const handleCheer = (
    event: React.MouseEvent<HTMLButtonElement>,
    userId: number,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    launchConfetti({
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    });
    cheerAnniversary(userId)
      .then(setData)
      .catch((error) =>
        toast.error(errorMessage(error, "Не удалось поздравить")),
      );
  };

  if (!data || data.anniversaries.length === 0) return null;

  const { anniversaries, viewerId } = data;
  const hasUncheered = anniversaries.some(
    (a) => a.userId !== viewerId && !a.cheeredBy.some((c) => c.id === viewerId),
  );
  const label = `Сегодня юбилей в гильдии: ${anniversaries
    .map((a) => a.username)
    .join(", ")}`;

  return (
    <div className="anniversary-balloons fixed right-4 top-12 z-40 lg:right-8 lg:top-0">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            aria-label={label}
            title={label}
            className="relative block h-9 w-20 cursor-pointer rounded-b-lg outline-none transition-transform hover:translate-y-0.5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <BalloonsArt />
            {hasUncheered && (
              <span className="absolute -bottom-1 right-1 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-primary" />
              </span>
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          sideOffset={32}
          className="w-80 overflow-hidden p-0"
        >
          <div className="flex items-center gap-2 bg-gradient-to-br from-primary/25 via-chart-1/15 to-transparent px-4 py-3 text-sm font-semibold">
            <Cake className="size-4 text-primary" />
            Сегодня юбилей в гильдии
          </div>
          <div className="max-h-[60vh] divide-y overflow-y-auto">
            {anniversaries.map((a) => (
              <AnniversaryRow
                key={a.userId}
                anniversary={a}
                viewerId={viewerId}
                onCheer={handleCheer}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
