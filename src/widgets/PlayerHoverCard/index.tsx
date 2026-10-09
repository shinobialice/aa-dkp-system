"use client";
import type { ReactElement } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/shared/ui";
import PlayerCardBody from "./PlayerCardBody";

type Props = {
  userId: number;
  children: ReactElement;
};

const OPEN_DELAY_MS = 400;
const CLOSE_DELAY_MS = 150;

export default function PlayerHoverCard({ userId, children }: Props) {
  return (
    <HoverCard openDelay={OPEN_DELAY_MS} closeDelay={CLOSE_DELAY_MS}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent align="start" className="w-72 overflow-hidden p-0">
        <PlayerCardBody userId={userId} />
      </HoverCardContent>
    </HoverCard>
  );
}
