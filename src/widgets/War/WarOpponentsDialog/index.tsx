"use client";

import { useState, type ReactNode } from "react";
import type {
  WarOpponentDraft,
  WarOpponentsState,
} from "@/actions/warOpponents";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";
import OpponentsForm from "./OpponentsForm";

export type SaveOpponents = (
  primary: { name: string | null; ended: boolean },
  opponents: WarOpponentDraft[],
) => Promise<void>;

type Props = {
  state: WarOpponentsState;
  warStartedAt: string | null;
  onSave: SaveOpponents;
  trigger: ReactNode;
};

export default function WarOpponentsDialog({
  state,
  warStartedAt,
  onSave,
  trigger,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Противники</DialogTitle>
          <DialogDescription>
            Всё это один вар. Если противник ушёл — жми «Слились»: его счётчик
            остановится, а сам он останется на странице и в истории с датами.
          </DialogDescription>
        </DialogHeader>
        <OpponentsForm
          state={state}
          warStartedAt={warStartedAt}
          onSave={async (primary, opponents) => {
            await onSave(primary, opponents);
            setOpen(false);
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
