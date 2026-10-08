import { ChevronDown, CircleDashed, Link2, Search } from "lucide-react";
import type { SavedBuild } from "@/actions/calculatorBuilds";
import type {
  CalculatorPlayer,
  CalculatorRole,
} from "@/actions/getCalculatorPlayer";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import MyRoleItems from "./MyRoleItems";
import SavedBuildItems from "./SavedBuildItems";

type Props = {
  label: string;
  viewer: CalculatorPlayer | null;
  savedBuilds: SavedBuild[];
  onEmpty: () => void;
  onRole: (player: CalculatorPlayer, role: CalculatorRole) => void;
  onPickPlayer: () => void;
  onOpenLink: () => void;
  onSaved: (saved: SavedBuild) => void;
};

export default function DollMenu({
  label,
  viewer,
  savedBuilds,
  onEmpty,
  onRole,
  onPickPlayer,
  onOpenLink,
  onSaved,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="max-w-full cursor-pointer"
        >
          <span className="truncate">{label}</span>
          <ChevronDown className="opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuItem className="cursor-pointer" onSelect={onEmpty}>
          <CircleDashed />
          Пустая кукла
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <SavedBuildItems savedBuilds={savedBuilds} onSelect={onSaved} />
        {viewer && (
          <>
            <MyRoleItems
              player={viewer}
              onSelect={(role) => onRole(viewer, role)}
            />
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem className="cursor-pointer" onSelect={onPickPlayer}>
          <Search />
          Экипировка игрока…
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onSelect={onOpenLink}>
          <Link2 />
          По ссылке…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
