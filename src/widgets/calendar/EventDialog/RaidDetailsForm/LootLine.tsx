import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";

type Props = {
  itemType: { name: string; icon_url: string | null; grade: number };
  quantity: number;
};

export default function LootLine({ itemType, quantity }: Props) {
  return (
    <>
      <LootIcon
        itemName={itemType.name}
        iconUrl={itemType.icon_url}
        grade={itemType.grade}
        size={22}
      />
      <span className="flex-1 truncate">{itemType.name}</span>
      <span className="shrink-0 text-muted-foreground">× {quantity}</span>
    </>
  );
}
