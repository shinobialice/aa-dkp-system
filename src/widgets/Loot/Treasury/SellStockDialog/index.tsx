"use client";

import { useState } from "react";
import { useRetainedValue } from "@/hooks/useRetainedValue";
import { formatNumber } from "@/shared/lib/format";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import type { PlayerOption } from "../../GuildLoot/PlayerCombobox";
import { LootIcon } from "../../LootBuy/icons/LootIconComponent";
import type { SellTarget } from "./sellStockModel";
import SellStockForm from "./SellStockForm";

type Props = {
  target: SellTarget | null;
  users: PlayerOption[];
  onClose: () => void;
  onDone: () => Promise<void>;
};

export default function SellStockDialog({
  target,
  users,
  onClose,
  onDone,
}: Props) {
  const shown = useRetainedValue(target);
  const [saving, setSaving] = useState(false);
  const group = shown?.group;

  return (
    <Dialog
      open={!!target}
      onOpenChange={(open) => !open && !saving && onClose()}
    >
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-120">
        {shown && group && (
          <>
            <DialogHeader className="flex-row items-center gap-3 pr-8 text-left">
              <LootIcon
                itemName={group.name}
                iconUrl={group.iconUrl}
                grade={group.grade}
                size={44}
              />
              <div className="min-w-0 space-y-1">
                <DialogTitle className="leading-snug">{group.name}</DialogTitle>
                <DialogDescription>
                  {group.sources.length > 0 && `${group.sources.join(", ")} · `}
                  на складе {group.quantity} шт.
                  {group.unitPrice !== null &&
                    ` по ${formatNumber(group.unitPrice)}`}
                </DialogDescription>
              </div>
            </DialogHeader>
            <SellStockForm
              key={`${group.itemTypeId}-${shown.mode}`}
              group={group}
              initialMode={shown.mode}
              users={users}
              saving={saving}
              onSavingChange={setSaving}
              onCancel={onClose}
              onDone={async () => {
                onClose();
                await onDone();
              }}
            />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
