import type { ArenaFighter, ArenaWindow } from "@/server/killcountArena/types";
import type { SortKey } from "../../ui/killcountModel";
import FighterRow from "./FighterRow";
import { metricOf, sortFighters } from "./killcountArenaModel";

type Props = {
  fighters: ArenaFighter[];
  sort: SortKey;
  window: ArenaWindow | null;
  search?: string;
  renderAction?: (fighter: ArenaFighter) => React.ReactNode;
};

export default function FighterList({
  fighters,
  sort,
  window,
  search = "",
  renderAction,
}: Props) {
  const sorted = sortFighters(fighters, sort);
  const max = Math.max(1, ...sorted.map((fighter) => metricOf(fighter, sort)));
  const term = search.trim().toLowerCase();
  const shown = term
    ? sorted.filter((fighter) => fighter.userName.toLowerCase().includes(term))
    : sorted;

  if (shown.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-muted-foreground">
        {term ? "Никого с таким ником" : "В киллкаунте пока никого нет"}
      </p>
    );
  }

  return (
    <ol>
      {shown.map((fighter) => (
        <FighterRow
          key={fighter.id}
          fighter={fighter}
          place={sorted.indexOf(fighter) + 1}
          sort={sort}
          max={max}
          window={window}
          action={renderAction?.(fighter)}
        />
      ))}
    </ol>
  );
}
