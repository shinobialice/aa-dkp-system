import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import type { LootItem } from "../../GuildLoot/LootTypes";
import type { JournalKind } from "../journalModel";
import type { RecordActions } from "./journalMeta";

type Props = RecordActions & {
  record: LootItem;
  kind: JournalKind;
};

export default function RecordMenu({
  record,
  kind,
  onEditRecord,
  onDeleteRecord,
}: Props) {
  const canEdit = kind !== "drop";
  const canDelete = kind !== "drop" || record.status === "В наличии";
  if (!canEdit && !canDelete) return <span className="size-8 shrink-0" />;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-my-1 shrink-0 text-muted-foreground"
          aria-label="Действия с записью"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit && (
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => onEditRecord(record)}
          >
            <Pencil />
            Изменить
          </DropdownMenuItem>
        )}
        {canEdit && canDelete && <DropdownMenuSeparator />}
        {canDelete && (
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => onDeleteRecord(record, kind)}
          >
            <Trash2 />
            Удалить…
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
