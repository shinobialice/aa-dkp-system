import { type Engraving } from "../itemsData/engravings";
import { cn } from "@/shared/lib/tw-merge";
import { EngravingIcon } from "../EngravingIcon";
import { EngravingTooltip } from "../EngravingTooltip";
import { highlightNumbers } from "../highlightNumbers";

type Props = {
  engraving: Engraving;
  isSelected: boolean;
  onSelect: (id: number) => void;
};

export default function EngravingOption({
  engraving,
  isSelected,
  onSelect,
}: Props) {
  return (
    <EngravingTooltip engraving={engraving} side="right">
      <button
        type="button"
        onClick={() => onSelect(engraving.id)}
        className={cn(
          "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
          isSelected && "bg-accent",
        )}
      >
        <EngravingIcon engraving={engraving} size={28} />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate">{engraving.name}</span>
          {engraving.effect && (
            <span className="line-clamp-2 text-xs text-muted-foreground">
              {highlightNumbers(engraving.effect)}
            </span>
          )}
        </span>
      </button>
    </EngravingTooltip>
  );
}
