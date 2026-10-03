"use client";

import type { ItemTypeRow } from "@/actions/itemTypeAdmin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import ItemTypeFormBody from "./ItemTypeFormBody";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  item: ItemTypeRow | null;
};

export function ItemTypeForm({ open, onClose, onSaved, item }: Props) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {item ? "Изменить предмет" : "Добавить предмет"}
          </DialogTitle>
        </DialogHeader>
        <ItemTypeFormBody item={item} onClose={onClose} onSaved={onSaved} />
      </DialogContent>
    </Dialog>
  );
}
