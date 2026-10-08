import { useState } from "react";
import type {
  CalculatorPlayer,
  CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import {
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Label,
} from "@/shared/ui";
import { buildFromRole, type CalculatorBuild } from "../calculatorModel";
import type { BuildSide } from "../useCalculator";
import PlayerList from "./PlayerList";
import PlayerRoles from "./PlayerRoles";

type Props = {
  side: BuildSide | null;
  onClose: () => void;
  onPick: (
    side: BuildSide,
    build: CalculatorBuild,
    withSettings: boolean,
  ) => void;
};

const TEXTS: Record<BuildSide, { title: string; description: string }> = {
  doll: {
    title: "Экипировка игрока",
    description:
      "Кукла станет копией экипировки игрока, а сам профиль не изменится.",
  },
  target: {
    title: "Сравнить с игроком",
    description:
      "Экипировка игрока встанет второй сборкой, а сам профиль не изменится.",
  },
};

export default function PlayerPickerDialog({ side, onClose, onPick }: Props) {
  const [playerId, setPlayerId] = useState<number | null>(null);
  const [withSettings, setWithSettings] = useState(true);

  if (!side) return null;

  const handleOpenChange = (open: boolean) => {
    if (open) return;
    setPlayerId(null);
    onClose();
  };

  const handlePick = (player: CalculatorPlayer, role: CalculatorRole) => {
    onPick(side, buildFromRole(player, role), withSettings);
    handleOpenChange(false);
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{TEXTS[side].title}</DialogTitle>
          <DialogDescription>{TEXTS[side].description}</DialogDescription>
        </DialogHeader>
        <PickerStep
          playerId={playerId}
          onPlayerSelect={setPlayerId}
          onPick={handlePick}
        />
        <Label className="cursor-pointer leading-snug font-normal">
          <Checkbox
            checked={withSettings}
            onCheckedChange={(checked) => setWithSettings(checked === true)}
          />
          Взять также уровень, баффы, печати и умения игрока
        </Label>
      </DialogContent>
    </Dialog>
  );
}

type PickerStepProps = {
  playerId: number | null;
  onPlayerSelect: (playerId: number | null) => void;
  onPick: (player: CalculatorPlayer, role: CalculatorRole) => void;
};

function PickerStep({ playerId, onPlayerSelect, onPick }: PickerStepProps) {
  if (playerId === null) return <PlayerList onSelect={onPlayerSelect} />;
  return (
    <PlayerRoles
      playerId={playerId}
      onBack={() => onPlayerSelect(null)}
      onPick={onPick}
    />
  );
}
