import type { ComponentProps } from "react";

type Props = ComponentProps<"div"> & {
  marked: number;
  unmarked: number;
  unmatched: number;
};

export default function ShotLegend({
  marked,
  unmarked,
  unmatched,
  ...props
}: Props) {
  return (
    <div
      {...props}
      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground"
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border-2 border-green-500 bg-green-500/20" />
        Отмечено {marked}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border-2 border-dashed border-zinc-400" />
        Снята отметка {unmarked}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm border-2 border-amber-500 bg-amber-400/25" />
        Не найдено {unmatched}
      </span>
      <span>
        Клик по зелёной рамке снимает отметку, по жёлтой — выбрать игрока
      </span>
    </div>
  );
}
