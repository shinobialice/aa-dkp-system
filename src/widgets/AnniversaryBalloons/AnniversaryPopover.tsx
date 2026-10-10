"use client";

import { useCallback, useEffect, useState } from "react";
import { Cake } from "lucide-react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/shared/ui";
import {
  cheerAnniversary,
  getTodayAnniversaries,
  type TodayAnniversaries,
} from "@/actions/anniversaryActions";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import { errorMessage } from "@/shared/lib/errorMessage";
import { launchConfetti } from "./launchConfetti";
import AnniversaryRow from "./AnniversaryRow";
import FloatingBalloonsButton from "./FloatingBalloonsButton";
import SidebarAnniversaryButton from "./SidebarAnniversaryButton";

type Props = {
  placement: "sidebar" | "floating";
};

const POLL_INTERVAL_MS = 60 * 1000;

const SEEN_STORAGE_KEY = "anniversaryPopoverSeenDate";

export default function AnniversaryPopover({ placement }: Props) {
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
  const names = anniversaries.map((a) => a.username).join(", ");
  const label = `Сегодня юбилей в гильдии: ${names}`;
  const isSidebar = placement === "sidebar";
  const trigger = isSidebar ? (
    <SidebarAnniversaryButton
      label={label}
      names={names}
      hasUncheered={hasUncheered}
    />
  ) : (
    <FloatingBalloonsButton label={label} hasUncheered={hasUncheered} />
  );

  const popover = (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={isSidebar ? "right" : "bottom"}
        align="end"
        sideOffset={isSidebar ? 8 : 32}
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
  );

  if (isSidebar) {
    return (
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>{popover}</SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    );
  }

  return (
    <div className="anniversary-balloons fixed top-12 right-4 z-40">
      {popover}
    </div>
  );
}

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
