import { Plus } from "lucide-react";
import { formatNumber } from "@/shared/lib/format";
import { Button, Card } from "@/shared/ui";
import type { ItemType } from "../../GuildLoot/LootTypes";
import { LootIcon } from "../../LootBuy/icons/LootIconComponent";
import type { MiscTotal } from "../treasuryModel";
import AmountPopover from "./AmountPopover";

type Props = {
  misc: MiscTotal[];
  itemTypes: ItemType[];
  isAdmin: boolean;
  monthLabel: string;
  onMiscSet: (name: string, amount: number) => Promise<void>;
};

export default function MiscCard({
  misc,
  itemTypes,
  isAdmin,
  monthLabel,
  onMiscSet,
}: Props) {
  const total = misc.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="gap-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold">Разное</h3>
        <span className="text-xs text-muted-foreground">за {monthLabel}</span>
      </div>
      <div className="space-y-2">
        {misc.map((item) => {
          const type = itemTypes.find(
            (itemType) => itemType.name === item.name,
          );
          return (
            <div key={item.name} className="flex items-center gap-2.5">
              <LootIcon
                itemName={item.name}
                iconUrl={type?.icon_url}
                grade={type?.grade}
                size={32}
              />
              <span className="min-w-0 flex-1 text-sm">{item.name}</span>
              {isAdmin && (
                <MiscAmountEditor item={item} onMiscSet={onMiscSet} />
              )}
              {!isAdmin && (
                <span className="font-semibold tabular-nums">
                  {formatNumber(item.amount)}
                </span>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex items-baseline justify-between gap-2 border-t pt-3 text-sm">
        <span className="text-muted-foreground">
          Итого, входит в доход месяца
        </span>
        <span className="font-bold tabular-nums">{formatNumber(total)}</span>
      </div>
    </Card>
  );
}

type MiscAmountEditorProps = {
  item: MiscTotal;
  onMiscSet: (name: string, amount: number) => Promise<void>;
};

function MiscAmountEditor({ item, onMiscSet }: MiscAmountEditorProps) {
  return (
    <div className="flex items-center gap-1">
      <AmountPopover
        label={`Сумма «${item.name}»`}
        initial={item.amount}
        submitLabel="Сохранить"
        onSubmit={(value) => onMiscSet(item.name, value)}
        trigger={
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 font-semibold tabular-nums"
          >
            {formatNumber(item.amount)}
          </Button>
        }
      />
      <AmountPopover
        label={`Добавить к «${item.name}»`}
        placeholder="+100"
        submitLabel="Добавить"
        onSubmit={(value) => onMiscSet(item.name, item.amount + value)}
        trigger={
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={`Добавить к «${item.name}»`}
          >
            <Plus />
          </Button>
        }
      />
    </div>
  );
}
