import Image from "next/image";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { highlightNumbers } from "../../highlightNumbers";
import { getNamedSetForItem } from "../../namedSetBonus";
import { getRuneSetForRune } from "../../runeSetBonus";

type Props = {
  itemId: number;
  runeId?: number;
  equipment: UserEquipment[];
};

type Tier = { count: number; text: string; active: boolean };

export default function SetProgress({ itemId, runeId, equipment }: Props) {
  const namedSet = getNamedSetForItem(itemId, equipment);
  const runeSet = runeId ? getRuneSetForRune(runeId, equipment) : null;

  return (
    <>
      {namedSet && (
        <SetSection
          title={`${namedSet.name} (${namedSet.ownedCount}/${namedSet.totalCount})`}
          tiers={namedSet.tiers}
        >
          <div className="space-y-1">
            {namedSet.pieceRows.map((row, index) => (
              <div key={index} className="flex gap-1">
                {row.map((piece) => (
                  <div
                    key={piece.itemId}
                    title={piece.name}
                    className={`relative size-6 shrink-0 overflow-hidden rounded-sm border ${
                      piece.owned
                        ? "border-border"
                        : "border-border/50 opacity-30 grayscale"
                    }`}
                  >
                    {piece.iconUrl && (
                      <Image
                        unoptimized
                        src={piece.iconUrl}
                        alt=""
                        fill
                        sizes="24px"
                        className="object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SetSection>
      )}
      {runeSet && (
        <SetSection
          title={`${runeSet.name} (${runeSet.count}/${runeSet.size})`}
          tiers={runeSet.tiers}
        />
      )}
    </>
  );
}

function SetSection({
  title,
  tiers,
  children,
}: {
  title: string;
  tiers: Tier[];
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="border-t border-border" />
      <div className="space-y-1">
        <div className="text-xs font-semibold">{title}</div>
        {children}
        <div className="space-y-1.5">
          {tiers.map((tier) => (
            <SetTierRow key={tier.count} tier={tier} />
          ))}
        </div>
      </div>
    </>
  );
}

function SetTierRow({ tier }: { tier: Tier }) {
  return (
    <div
      className={tier.active ? "text-green-500" : "text-muted-foreground/70"}
    >
      <div className="text-2xs font-semibold">[{tier.count} шт.]</div>
      {tier.text.split("\n").map((line, index) => (
        <div key={index} className="text-xs">
          {tier.active ? highlightNumbers(line) : line}
        </div>
      ))}
    </div>
  );
}
