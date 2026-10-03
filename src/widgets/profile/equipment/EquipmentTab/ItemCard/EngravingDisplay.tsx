import { EngravingIcon } from "../../EngravingIcon";
import { findEngraving } from "../../itemsData/engravings";
import { EffectText } from "../../highlightNumbers";

type Props = {
  count: number;
  engravings: number[];
};

export default function EngravingDisplay({ count, engravings }: Props) {
  if (count === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: count }, (_, index) => {
        const engraving = findEngraving(engravings[index] ?? 0);
        if (!engraving) {
          return (
            <div
              key={index}
              className="size-5 shrink-0 rounded-sm border border-border bg-muted"
            />
          );
        }
        return (
          <div key={index} className="flex items-center gap-1.5">
            <EngravingIcon engraving={engraving} size={20} />
            {engraving.effect && (
              <div className="text-xs text-green-500">
                <EffectText text={engraving.effect} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
