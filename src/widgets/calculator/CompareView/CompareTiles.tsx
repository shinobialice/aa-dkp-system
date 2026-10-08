import { cn } from "@/shared/lib/tw-merge";
import { StatTile } from "@/shared/ui";
import type { CompareTile } from "./compareModel";
import { DIFF_TONE_CLASS, LETTER_CLASS } from "./compareStyles";

type Props = {
  tiles: CompareTile[];
};

export default function CompareTiles({ tiles }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
      {tiles.map((tile) => (
        <StatTile
          key={tile.label}
          label={tile.label}
          hint={<TileValues a={tile.a} b={tile.b} />}
        >
          <span className={cn("text-xl", DIFF_TONE_CLASS[tile.tone])}>
            {tile.tone === "same" ? "без разницы" : tile.diff}
          </span>
        </StatTile>
      ))}
    </div>
  );
}

function TileValues({ a, b }: { a: string; b: string }) {
  return (
    <span className="flex flex-wrap gap-x-3 gap-y-0.5 tabular-nums">
      <span className="inline-flex items-center gap-1">
        <span className={cn("size-2 rounded-sm", LETTER_CLASS.A)} />
        {a}
      </span>
      <span className="inline-flex items-center gap-1">
        <span className={cn("size-2 rounded-sm", LETTER_CLASS.B)} />
        {b}
      </span>
    </span>
  );
}
