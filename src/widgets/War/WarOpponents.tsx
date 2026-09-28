"use client";

import { useState } from "react";
import {
  saveWarOpponents,
  type WarOpponentDraft,
  type WarOpponentsState,
} from "@/actions/guildStatusSettings";
import WarOpponentsDialog from "./WarOpponentsDialog";
import WarPeriodTimer from "./WarPeriodTimer";

function OpponentColumn({
  name,
  startedAt,
  endedAt,
}: {
  name: string | null;
  startedAt: string | null;
  endedAt: string | null;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-lg">
        против{" "}
        <strong
          className={endedAt ? "text-muted-foreground" : "text-destructive"}
        >
          {name ?? "противник не указан"}
        </strong>
      </span>
      {startedAt && (
        <WarPeriodTimer
          label={endedAt ? "Слились" : "Вар идёт"}
          startedAt={startedAt}
          endedAt={endedAt}
        />
      )}
    </div>
  );
}

export default function WarOpponents({
  title,
  initialState,
  warStartedAt,
  isAdmin,
}: {
  title: string;
  initialState: WarOpponentsState;
  warStartedAt: string | null;
  isAdmin: boolean;
}) {
  const [state, setState] = useState(initialState);

  async function handleSave(
    primary: { name: string | null; ended: boolean },
    opponents: WarOpponentDraft[],
  ) {
    setState(await saveWarOpponents(primary, opponents));
  }

  return (
    <>
      <h1 className="text-2xl font-bold">
        {isAdmin ? (
          <WarOpponentsDialog
            state={state}
            warStartedAt={warStartedAt}
            onSave={handleSave}
            trigger={
              <button
                type="button"
                title="Редактировать противников"
                className="cursor-pointer transition-colors hover:text-primary"
              >
                {title}
              </button>
            }
          />
        ) : (
          title
        )}
      </h1>
      <div className="flex flex-wrap items-start justify-center gap-x-12 gap-y-6">
        <OpponentColumn
          name={state.primary.name}
          startedAt={warStartedAt}
          endedAt={state.primary.endedAt}
        />
        {state.opponents.map((opponent) => (
          <OpponentColumn
            key={opponent.id}
            name={opponent.name}
            startedAt={opponent.startedAt}
            endedAt={opponent.endedAt}
          />
        ))}
      </div>
    </>
  );
}
