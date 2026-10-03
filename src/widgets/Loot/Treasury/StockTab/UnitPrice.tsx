import { formatNumber } from "@/shared/lib/format";
import type { StockGroup } from "../stockModel";

type Props = {
  group: StockGroup;
  isAdmin: boolean;
  onEditPrice: (group: StockGroup) => void;
};

export default function UnitPrice({ group, isAdmin, onEditPrice }: Props) {
  if (group.unitPrice !== null) return formatNumber(group.unitPrice);
  if (group.isBundled) {
    return <span className="text-muted-foreground">в комплекте</span>;
  }
  if (!isAdmin) return <span className="text-muted-foreground">—</span>;

  return (
    <button
      type="button"
      onClick={() => onEditPrice(group)}
      className="cursor-pointer font-medium text-green-700 hover:underline dark:text-green-400"
    >
      Задать цену
    </button>
  );
}
