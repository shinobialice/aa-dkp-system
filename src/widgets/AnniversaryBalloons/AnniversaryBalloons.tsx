"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Cake, PartyPopper } from "lucide-react";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import {
  cheerAnniversary,
  getTodayAnniversaries,
  type Anniversary,
  type TodayAnniversaries,
} from "@/actions/anniversaryActions";
import { useVisiblePolling } from "@/hooks/useVisiblePolling";
import { pluralizeYears } from "@/utils/pluralizeYears";

const POLL_INTERVAL_MS = 60 * 1000;
const SEEN_STORAGE_KEY = "anniversaryPopoverSeenDate";
const CONFETTI_COLORS = ["#2f9e62", "#e89d35", "#5a36a5", "#d764a8"];
const NAMES_LIMIT = 5;

const balloons = [
  {
    cx: 17,
    cy: 9,
    rx: 11,
    ry: 14,
    color: "#d764a8",
    string: "M17 26 q-3 6 0 12 t0 12",
    duration: "3.4s",
    delay: "0s",
  },
  {
    cx: 49,
    cy: 11,
    rx: 10,
    ry: 13,
    color: "#e89d35",
    string: "M49 27 q-3 5 0 10 t0 10",
    duration: "3.8s",
    delay: "-0.6s",
  },
  {
    cx: 33,
    cy: 5,
    rx: 12,
    ry: 15,
    color: "#2f9e62",
    string: "M33 23 q3 7 0 14 t0 14",
    duration: "3s",
    delay: "-1.2s",
  },
];

function BalloonsArt() {
  return (
    <svg
      viewBox="0 0 64 54"
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-[67.5px] w-20 text-muted-foreground"
    >
      {balloons.map((b) => {
        const bottom = b.cy + b.ry;
        const shineX = b.cx - b.rx * 0.45;
        const shineY = b.cy + b.ry * 0.2;
        return (
          <g
            key={b.color}
            className="anniversary-balloon"
            style={{ animationDuration: b.duration, animationDelay: b.delay }}
          >
            <path
              d={b.string}
              fill="none"
              stroke="currentColor"
              strokeWidth={0.8}
              strokeLinecap="round"
            />
            <path
              d={`M${b.cx - 2.5} ${bottom + 3} L${b.cx + 2.5} ${bottom + 3} L${b.cx} ${bottom - 0.5} Z`}
              fill={b.color}
            />
            <ellipse cx={b.cx} cy={b.cy} rx={b.rx} ry={b.ry} fill={b.color} />
            <ellipse
              cx={shineX}
              cy={shineY}
              rx={b.rx * 0.2}
              ry={b.ry * 0.3}
              fill="white"
              opacity={0.35}
              transform={`rotate(25 ${shineX} ${shineY})`}
            />
          </g>
        );
      })}
    </svg>
  );
}

async function launchConfetti(origin: { x: number; y: number }) {
  const { default: confetti } = await import("canvas-confetti");
  const base = {
    colors: CONFETTI_COLORS,
    zIndex: 100,
    disableForReducedMotion: true,
  };

  confetti({
    ...base,
    particleCount: 90,
    spread: 80,
    startVelocity: 40,
    origin,
  });

  [0.2, 0.5, 0.8].forEach((x, i) => {
    setTimeout(
      () => {
        confetti({
          ...base,
          particleCount: 70,
          spread: 120,
          startVelocity: 35,
          origin: { x, y: 0.3 },
        });
      },
      250 + i * 200,
    );
  });

  const end = Date.now() + 1500;
  (function frame() {
    confetti({
      ...base,
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
    });
    confetti({
      ...base,
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

function shouldAutoOpen(data: TodayAnniversaries) {
  if (data.anniversaries.length === 0) return false;
  try {
    if (window.localStorage.getItem(SEEN_STORAGE_KEY) === data.date)
      return false;
    window.localStorage.setItem(SEEN_STORAGE_KEY, data.date);
    return true;
  } catch {
    return false;
  }
}

function AnniversaryRow({
  anniversary,
  viewerId,
  onCheer,
  onNavigate,
}: {
  anniversary: Anniversary;
  viewerId: number | null;
  onCheer: (event: React.MouseEvent<HTMLButtonElement>, userId: number) => void;
  onNavigate: () => void;
}) {
  const { userId, username, avatarUrl, years, cheeredBy } = anniversary;
  const isSelf = userId === viewerId;
  const hasCheered = cheeredBy.some((c) => c.id === viewerId);
  const names = cheeredBy
    .slice(0, NAMES_LIMIT)
    .map((c) => c.username)
    .join(", ");
  const restCount = cheeredBy.length - NAMES_LIMIT;
  const yearsText = `${years} ${pluralizeYears(years)} в гильдии`;

  return (
    <div className="flex gap-3 px-4 py-3">
      <Link
        href={`/profile/${userId}`}
        onClick={onNavigate}
        className="shrink-0"
      >
        <Avatar className="size-10">
          <AvatarImage
            src={
              avatarUrl ??
              `https://api.dicebear.com/6.x/initials/svg?seed=${username}`
            }
            alt={username}
          />
          <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="min-w-0 flex-1 space-y-2">
        <div>
          <Link
            href={`/profile/${userId}`}
            onClick={onNavigate}
            className="block truncate font-medium hover:underline"
          >
            {username}
          </Link>
          <div className="text-xs text-muted-foreground">
            {isSelf ? `Твой юбилей — ${yearsText}!` : yearsText}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant={hasCheered ? "outline" : "default"}
            onClick={(e) => onCheer(e, userId)}
          >
            <PartyPopper />
            {hasCheered ? "Ещё ура!" : "Ура!"}
          </Button>
          <span className="text-xs text-muted-foreground">
            {isSelf ? "Тебя поздравили" : "Поздравили"}: {cheeredBy.length}
          </span>
        </div>
        {cheeredBy.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {names}
            {restCount > 0 && ` и ещё ${restCount}`}
          </div>
        )}
      </div>
    </div>
  );
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
        toast.error(
          error instanceof Error ? error.message : "Не удалось поздравить",
        ),
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
