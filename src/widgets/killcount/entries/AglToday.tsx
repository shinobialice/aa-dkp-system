import { Swords } from "lucide-react";
import type { AglItem, KillcountEntry } from "@/server/killcountEntries/types";
import AglEntries from "./AglEntries";

type Props = {
  items: AglItem[];
  selected: KillcountEntry | null;
};

export default function AglToday({ items, selected }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed bg-card px-4 py-14 text-center">
        <Swords className="size-8 text-muted-foreground" />
        <p className="text-base font-semibold">Сегодня АГЛ ещё не было</p>
        <p className="max-w-sm text-sm text-muted-foreground">
          Киллкаунт появится, если на АГЛ сходит кто-то со сканером. Прошлые АГЛ
          — во вкладке «История».
        </p>
      </div>
    );
  }
  return (
    <AglEntries
      page="/kill-counter/current"
      items={items}
      selected={selected}
    />
  );
}
