import { ChevronLeft } from "lucide-react";
import {
  getCalculatorPlayer,
  type CalculatorPlayer,
  type CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "@/shared/ui";
import { EQUIPMENT_SLOTS } from "@/widgets/profile/equipment/equipmentData";
import { roleDetails } from "../calculatorModel";

type Props = {
  playerId: number;
  onBack: () => void;
  onPick: (player: CalculatorPlayer, role: CalculatorRole) => void;
};

export default function PlayerRoles({ playerId, onBack, onPick }: Props) {
  const { data: player, error } = useAsyncData(
    `calculator-player-${playerId}`,
    () => getCalculatorPlayer(playerId),
  );

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer self-start"
        onClick={onBack}
      >
        <ChevronLeft />
        Другой игрок
      </Button>
      <RolesContent player={player} hasError={!!error} onPick={onPick} />
    </div>
  );
}

type RolesContentProps = {
  player: CalculatorPlayer | null | undefined;
  hasError: boolean;
  onPick: (player: CalculatorPlayer, role: CalculatorRole) => void;
};

function RolesContent({ player, hasError, onPick }: RolesContentProps) {
  if (hasError || player === null) {
    return (
      <p className="text-sm text-destructive">
        Не удалось загрузить экипировку игрока
      </p>
    );
  }
  if (!player) {
    return <p className="text-sm text-muted-foreground">Загружаем…</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-muted-foreground">
        Какую роль взять у {player.username}
      </span>
      {player.roles.map((role) => (
        <Button
          key={role.roleSlot}
          variant="outline"
          className="h-auto cursor-pointer justify-between py-2.5"
          onClick={() => onPick(player, role)}
        >
          <span className="flex flex-col items-start gap-0.5">
            <span>{role.label}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {roleDetails(role)}
            </span>
          </span>
          <span className="text-xs font-normal text-muted-foreground">
            {role.equipment.length} из {EQUIPMENT_SLOTS.length} ячеек
          </span>
        </Button>
      ))}
    </div>
  );
}
