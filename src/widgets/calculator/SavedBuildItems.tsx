import type { SavedBuild } from "@/actions/calculatorBuilds";
import {
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/shared/ui";
import { snapshotDetails } from "./buildSnapshot";

type Props = {
  savedBuilds: SavedBuild[];
  onSelect: (saved: SavedBuild) => void;
};

export default function SavedBuildItems({ savedBuilds, onSelect }: Props) {
  if (savedBuilds.length === 0) return null;

  return (
    <>
      <DropdownMenuLabel className="text-xs text-muted-foreground">
        Мои куклы
      </DropdownMenuLabel>
      {savedBuilds.map((saved) => (
        <DropdownMenuItem
          key={saved.id}
          className="cursor-pointer flex-col items-start gap-0.5"
          onSelect={() => onSelect(saved)}
        >
          <span className="max-w-full truncate">{saved.snapshot.name}</span>
          <span className="text-xs text-muted-foreground">
            {snapshotDetails(saved.snapshot)}
          </span>
        </DropdownMenuItem>
      ))}
      <DropdownMenuSeparator />
    </>
  );
}
