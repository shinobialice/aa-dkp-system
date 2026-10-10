"use client";

import { useState } from "react";
import type {
  UserKillcountDay,
  UserKillcountHistory,
  UserKillcountPlace,
} from "@/actions/getUserKillcountHistory";
import { Segmented } from "@/shared/ui";
import { ALL_DAYS } from "@/widgets/killcount/ui/killcountModel";
import KillcountDayList from "./KillcountDayList";
import KillcountDaysChart from "./KillcountDaysChart";
import KillcountTiles from "./KillcountTiles";
import {
  daysOfWar,
  participationText,
  playedDays,
  warOptions,
  type PlayedDay,
} from "./profileKillcountModel";

type Props = {
  history: UserKillcountHistory;
};

export default function KillcountOverview({ history }: Props) {
  const [selectedWarId, setSelectedWarId] = useState<string | null>(null);
  const warId = selectedWarId ?? history.wars.at(0)?.id ?? ALL_DAYS;
  const days = daysOfWar(history.days, warId);
  const played = playedDays(days);
  const place = history.places.find((item) => item.warId === warId);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Киллкаунт</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {participationText(played.length, days.length)}
          </p>
        </div>
        <Segmented
          label="Вар"
          value={warId}
          options={warOptions(history.wars)}
          onChange={setSelectedWarId}
        />
      </div>
      <WarStats days={days} played={played} place={place} />
    </>
  );
}

function WarStats({
  days,
  played,
  place,
}: {
  days: UserKillcountDay[];
  played: PlayedDay[];
  place: UserKillcountPlace | undefined;
}) {
  if (played.length === 0) {
    return (
      <p className="rounded-lg border border-dashed px-3 py-8 text-center text-sm text-muted-foreground">
        За этот период в киллкаунте записей нет
      </p>
    );
  }

  return (
    <>
      <KillcountTiles played={played} place={place} />
      <KillcountDaysChart days={days} />
      <KillcountDayList played={played} />
    </>
  );
}
