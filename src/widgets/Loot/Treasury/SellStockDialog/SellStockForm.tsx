"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { toast } from "sonner";
import { distributeLootStock } from "@/actions/distributeLootItems";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import {
  Button,
  DateTimePicker,
  DialogFooter,
  Label,
  Tabs,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui";
import PlayerCombobox, {
  type PlayerChoice,
  type PlayerOption,
} from "../../GuildLoot/PlayerCombobox";
import type { StockGroup } from "../stockModel";
import QuantityStepper from "./QuantityStepper";
import SalePriceFields from "./SalePriceFields";
import { clampQuantity, fifoSummary, type SellMode } from "./sellStockModel";

type Props = {
  group: StockGroup;
  initialMode: SellMode;
  users: PlayerOption[];
  saving: boolean;
  onSavingChange: (saving: boolean) => void;
  onCancel: () => void;
  onDone: () => Promise<void>;
};

export default function SellStockForm({
  group,
  initialMode,
  users,
  saving,
  onSavingChange,
  onCancel,
  onDone,
}: Props) {
  const [mode, setMode] = useState(initialMode);
  const [recipient, setRecipient] = useState<PlayerChoice>({ name: "" });
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(group.unitPrice ?? 0);
  const [manualTotal, setManualTotal] = useState<number | null>(null);
  const [soldAt, setSoldAt] = useState(() => new Date());
  const [comment, setComment] = useState("");
  const isSell = mode === "sell";
  const total = manualTotal ?? quantity * unitPrice;

  const handleSubmit = async () => {
    const soldTo = recipient.name.trim();
    if (!soldTo) {
      toast.error(isSell ? "Укажите, кому продали" : "Укажите, кому выдали");
      return;
    }
    if (isSell && total <= 0) {
      toast.error("Укажите сумму продажи");
      return;
    }
    onSavingChange(true);
    try {
      await distributeLootStock({
        itemTypeId: group.itemTypeId,
        quantity,
        soldTo,
        soldToId: recipient.id,
        isFree: !isSell,
        comment: comment.trim() || undefined,
        price: isSell ? total : 0,
        soldAt: soldAt.toISOString(),
      });
      const suffix = quantity > 1 ? ` ×${quantity}` : "";
      toast.success(`${isSell ? "Продано" : "Выдано"}: ${group.name}${suffix}`);
      await onDone();
    } catch (error) {
      console.error(error);
      const action = isSell ? "продать" : "выдать";
      toast.error(
        `Не удалось ${action} — обновите страницу и попробуйте снова`,
      );
    } finally {
      onSavingChange(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as SellMode)}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sell" className="cursor-pointer">
              Продать
            </TabsTrigger>
            <TabsTrigger value="gift" className="cursor-pointer">
              Выдать бесплатно
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stock-recipient">Кому</Label>
          <PlayerCombobox
            id="stock-recipient"
            users={users}
            value={recipient}
            onChange={setRecipient}
          />
        </div>

        <QuantityStepper
          value={quantity}
          max={group.quantity}
          onChange={(value) =>
            setQuantity(clampQuantity(value, group.quantity))
          }
        />

        {isSell && (
          <SalePriceFields
            unitPrice={unitPrice}
            total={total}
            isManual={manualTotal !== null}
            onUnitPriceChange={setUnitPrice}
            onTotalChange={setManualTotal}
            onReset={() => setManualTotal(null)}
          />
        )}

        <div className="flex flex-col gap-2">
          <Label>{isSell ? "Дата продажи" : "Дата выдачи"}</Label>
          <DateTimePicker
            hideTime
            value={soldAt}
            onChange={(date) => date && setSoldAt(date)}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stock-comment">Комментарий</Label>
          <Textarea
            id="stock-comment"
            rows={2}
            value={comment}
            placeholder={
              isSell
                ? "Например: выиграл ролл"
                : "Например: на пробуждение мантии"
            }
            onChange={(event) => setComment(event.target.value)}
          />
        </div>

        <div className="flex gap-2.5 rounded-lg border bg-muted/40 p-3 text-sm">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
          <div>
            <p className="font-medium">Спишутся самые старые дропы</p>
            <p className="text-muted-foreground">
              {fifoSummary(group, quantity)}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onCancel} disabled={saving}>
          Отмена
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          className={cn(
            !isSell && "bg-violet-600 text-white hover:bg-violet-600/90",
          )}
        >
          {isSell
            ? `Продать за ${formatNumber(total)}`
            : `Выдать ${quantity} шт.`}
        </Button>
      </DialogFooter>
    </>
  );
}
