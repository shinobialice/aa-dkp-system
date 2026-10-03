"use client";

import { useRetainedValue } from "@/hooks/useRetainedValue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import type { LootItem } from "../LootTypes";
import TreasuryIncomeForm, {
  type TreasuryIncomeValues,
} from "./TreasuryIncomeForm";

type Props = {
  item: LootItem | null;
  onClose: () => void;
  onSave: (values: TreasuryIncomeValues) => Promise<void>;
};

// Правка ручной строки дохода "В казну". У такой строки нет покупателя,
// поэтому вместо диалога продажи — свой узкий: источник, дата и сумма.
export default function TreasuryIncomeDialog({ item, onClose, onSave }: Props) {
  const shown = useRetainedValue(item);

  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить поступление в казну</DialogTitle>
        </DialogHeader>
        {shown && (
          <TreasuryIncomeForm
            key={shown.id}
            item={shown}
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
