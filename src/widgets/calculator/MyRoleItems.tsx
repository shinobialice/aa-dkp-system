import type {
  CalculatorPlayer,
  CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import { DropdownMenuItem, DropdownMenuLabel } from "@/shared/ui";
import { roleDetails } from "./calculatorModel";

type Props = {
  player: CalculatorPlayer;
  onSelect: (role: CalculatorRole) => void;
};

export default function MyRoleItems({ player, onSelect }: Props) {
  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Моя экипировка
      </DropdownMenuLabel>
      {player.roles.map((role) => (
        <DropdownMenuItem
          key={role.roleSlot}
          className="cursor-pointer justify-between gap-3"
          onSelect={() => onSelect(role)}
        >
          <span className="truncate">{role.label}</span>
          <span className="shrink-0 text-xs text-muted-foreground">
            {roleDetails(role)}
          </span>
        </DropdownMenuItem>
      ))}
    </>
  );
}
