import type { ItemTypeRow } from "@/actions/itemTypeAdmin";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { Button, TableCell, TableRow } from "@/shared/ui";
import { getCategoryLabel } from "./itemTypeSort";

type Props = {
  item: ItemTypeRow;
  onEdit: (item: ItemTypeRow) => void;
  onDelete: (item: ItemTypeRow) => void;
};

export default function ItemTypeRowView({ item, onEdit, onDelete }: Props) {
  return (
    <TableRow>
      <TableCell>
        <LootIcon
          itemName={item.name}
          iconUrl={item.icon_url}
          grade={item.grade}
          size={32}
        />
      </TableCell>
      <TableCell>{item.name}</TableCell>
      <TableCell>{item.price ?? "—"}</TableCell>
      <TableCell>{item.source ?? "Разное"}</TableCell>
      <TableCell>{getCategoryLabel(item.category)}</TableCell>
      <TableCell>{item.show_in_buy ? "Да" : "Нет"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="cursor-pointer"
            onClick={() => onEdit(item)}
          >
            Изменить
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="cursor-pointer text-destructive hover:text-destructive"
            onClick={() => onDelete(item)}
          >
            Удалить
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
