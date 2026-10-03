import { LootIcon } from "../icons/LootIconComponent";
import type { MyPlace } from "../LootItemList";
import { playersCount, type BuyItem } from "../lootBuyModel";

type Props = {
  items: BuyItem[];
  places: Record<string, MyPlace>;
  onSelect: (name: string) => void;
};

export default function MyQueues({ items, places, onSelect }: Props) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Мои очереди"
      className="flex flex-col gap-2 rounded-xl border border-green-200 bg-green-50 p-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 sm:px-4 dark:border-green-500/25 dark:bg-green-500/5"
    >
      <span className="text-sm font-semibold text-green-700 dark:text-green-400">
        Мои очереди
      </span>
      {items.map((item) => {
        const { place, total } = places[item.name];
        return (
          <button
            key={item.name}
            type="button"
            onClick={() => onSelect(item.name)}
            className="flex min-h-12 cursor-pointer items-center gap-2.5 rounded-lg border border-green-200 bg-background py-1.5 pr-3 pl-1.5 text-left hover:bg-green-50/50 dark:border-green-500/25"
          >
            <LootIcon
              itemName={item.name}
              iconUrl={item.icon}
              grade={item.grade}
              size={32}
            />
            <span className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">{item.name}</span>
              <span className="text-xs text-green-800 dark:text-green-300">
                {place}-е место из {total}
                {place > 1 && ` · перед вами ${playersCount(place - 1)}`}
              </span>
            </span>
          </button>
        );
      })}
    </section>
  );
}
