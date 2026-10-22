import { StatTile, StatUnit } from "@/shared/ui";
import type { SummaryTile } from "./killcountEntriesModel";

type Props = {
  tiles: SummaryTile[];
};

export default function EntrySummary({ tiles }: Props) {
  return (
    <section
      aria-label="Итоги"
      className="grid grid-cols-2 gap-2.5 lg:grid-cols-4"
    >
      {tiles.map((tile, index) => (
        <StatTile key={tile.label} label={tile.label} hint={tile.hint}>
          <span className={index === 0 ? "text-red-600 dark:text-red-400" : ""}>
            {tile.value}
          </span>
          {tile.unit && <StatUnit>{tile.unit}</StatUnit>}
        </StatTile>
      ))}
    </section>
  );
}
