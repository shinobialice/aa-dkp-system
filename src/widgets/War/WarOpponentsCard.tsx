"use client";

import type { ReactNode } from "react";
import { Swords } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import OpponentTile from "./OpponentTile";
import type { OpponentView } from "./opponentsModel";
import { MINUTE_MS, MINUTE_POLL_MS } from "./warModel";
import WarSection from "./WarSection";

type Props = {
  opponents: OpponentView[];
  action?: ReactNode;
  emptyText?: string;
};

export default function WarOpponentsCard({
  opponents,
  action,
  emptyText = "Противник не указан",
}: Props) {
  const now = useClock(MINUTE_MS, MINUTE_POLL_MS);

  return (
    <WarSection
      title="Противники"
      icon={Swords}
      action={action}
      empty={opponents.length === 0 ? emptyText : null}
    >
      <div className="grid grid-cols-2 gap-2 px-3 pb-3 sm:grid-cols-[repeat(auto-fill,minmax(240px,1fr))] sm:gap-3 sm:px-4 sm:pb-4">
        {opponents.map((opponent) => (
          <OpponentTile key={opponent.key} opponent={opponent} now={now} />
        ))}
      </div>
    </WarSection>
  );
}
