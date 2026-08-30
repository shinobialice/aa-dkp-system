import { cloneElement } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { classColors, classIcons } from "@/widgets/MembersTable/classStyles";
import type { NamedPlayer } from "@/actions/guildStats";

// Список ников в тултипе: длинные списки (много игроков в одном классе/
// печати/предмете) сводим в 2-3 колонки, чтобы тултип не растягивался в
// длинную простыню на весь экран. Роль игрока обозначена иконкой-бейджем
// (см. classIcons/classColors) — а не цветом самого ника: на зелёном фоне
// тултипа (--primary) цветной текст, особенно зелёный "Тактик", сливался и
// читался плохо, а закрашенный бейдж с иконкой контрастен всегда, как и в
// MembersTable.
const COLUMN_CLASS: Record<1 | 2 | 3, string> = {
  1: "columns-1 max-w-64",
  2: "columns-2 max-w-[22rem]",
  3: "columns-3 max-w-[30rem]",
};

const FALLBACK_COLOR = "rgb(120,120,120)";

function getColumns(count: number): 1 | 2 | 3 {
  if (count > 8) return 3;
  if (count > 4) return 2;
  return 1;
}

export default function PlayerNameList({ players }: { players: NamedPlayer[] }) {
  if (players.length === 0) return null;

  return (
    <div className={cn("gap-x-4", COLUMN_CLASS[getColumns(players.length)])}>
      {players.map((player) => {
        const icon = player.class ? classIcons[player.class] : null;
        return (
          <div
            key={player.username}
            className="flex items-center gap-1.5 break-inside-avoid whitespace-nowrap py-0.5"
          >
            {icon && (
              <span
                className="flex size-4 shrink-0 items-center justify-center rounded-full text-background"
                style={{ backgroundColor: classColors[player.class!] ?? FALLBACK_COLOR }}
                title={player.class ?? undefined}
              >
                {cloneElement(icon, { className: "size-2.5" })}
              </span>
            )}
            <span>{player.username}</span>
            {player.suffix && <span className="opacity-70"> {player.suffix}</span>}
          </div>
        );
      })}
    </div>
  );
}
