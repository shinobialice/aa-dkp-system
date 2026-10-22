import type { ScoreTile } from "./killcountArenaModel";

type Props = {
  tiles: ScoreTile[];
};

export default function ScoreTiles({ tiles }: Props) {
  return (
    <section
      aria-label="Итоги"
      className="grid grid-cols-2 gap-3 md:grid-cols-4"
    >
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="min-w-0 border border-l-[3px] border-l-green-500 bg-card px-4 py-3.5"
        >
          <p className="text-2xs tracking-widest text-muted-foreground uppercase">
            {tile.label}
          </p>
          <p className="truncate font-display text-[clamp(22px,3vw,32px)] leading-tight tabular-nums">
            {tile.value}
          </p>
          {tile.hint && (
            <p className="text-xs text-muted-foreground">{tile.hint}</p>
          )}
        </div>
      ))}
    </section>
  );
}
