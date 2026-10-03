"use client";

import { useRetainedValue } from "@/hooks/useRetainedValue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import type { LootItem } from "../LootTypes";
import type { PlayerOption } from "../PlayerCombobox";
import EditSaleForm, { type SaleValues } from "./EditSaleForm";

type Props = {
  record: LootItem | null;
  users: PlayerOption[];
  onClose: () => void;
  onSave: (values: SaleValues) => Promise<void>;
};

export default function EditSaleDialog({
  record,
  users,
  onClose,
  onSave,
}: Props) {
  const shown = useRetainedValue(record);

  return (
    <Dialog open={!!record} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="max-w-100">
        <DialogHeader>
          <DialogTitle>Изменение предмета: {shown?.itemType.name}</DialogTitle>
        </DialogHeader>
        {shown && (
          <EditSaleForm
            key={shown.id}
            record={shown}
            users={users}
            onCancel={onClose}
            onSave={async (values) => {
              await onSave(values);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
