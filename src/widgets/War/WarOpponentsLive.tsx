"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import {
  saveWarOpponents,
  type WarOpponentDraft,
  type WarOpponentsState,
} from "@/actions/warOpponents";
import { Button } from "@/shared/ui";
import { liveOpponents } from "./opponentsModel";
import WarOpponentsCard from "./WarOpponentsCard";
import WarOpponentsDialog from "./WarOpponentsDialog";

type Props = {
  initialState: WarOpponentsState;
  warStartedAt: string | null;
  isAdmin: boolean;
};

export default function WarOpponentsLive({
  initialState,
  warStartedAt,
  isAdmin,
}: Props) {
  const [state, setState] = useState(initialState);
  const opponents = liveOpponents(state, warStartedAt);

  const handleSave = async (
    primary: { name: string | null; ended: boolean },
    drafts: WarOpponentDraft[],
  ) => {
    setState(await saveWarOpponents(primary, drafts));
  };

  const action = isAdmin && (
    <WarOpponentsDialog
      state={state}
      warStartedAt={warStartedAt}
      onSave={handleSave}
      trigger={
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Pencil />
          {opponents.length ? "Изменить" : "Указать"}
        </Button>
      }
    />
  );

  return <WarOpponentsCard opponents={opponents} action={action} />;
}
