"use client";

import { useState } from "react";
import { Coins } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  DateTimePicker,
  DialogFooter,
  Input,
  Label,
} from "@/shared/ui";
import type { LootItem } from "../LootTypes";
import PlayerCombobox, {
  type PlayerChoice,
  type PlayerOption,
} from "../PlayerCombobox";

export type SaleValues = {
  soldTo: string;
  soldToId?: number;
  price: number;
  comment: string;
  quantity: number;
  isFree: boolean;
  soldAt: string;
};

type Props = {
  record: LootItem;
  users: PlayerOption[];
  onCancel: () => void;
  onSave: (values: SaleValues) => Promise<void>;
};

export default function EditSaleForm({
  record,
  users,
  onCancel,
  onSave,
}: Props) {
  const initialPrice = record.price ?? record.itemType.price ?? 0;
  // В записи хранится ОБЩАЯ цена за всю проданную партию, а не за 1 шт. —
  // пересчёт quantity * unitPrice от общей цены раздувал сумму за пределы
  // integer в БД.
  const unitPrice = record.quantity
    ? initialPrice / record.quantity
    : initialPrice;

  const [buyer, setBuyer] = useState<PlayerChoice>({
    name: record.sold_to ?? "",
    id: record.sold_to_user_id ?? undefined,
  });
  const [quantity, setQuantity] = useState(record.quantity);
  const [manualPrice, setManualPrice] = useState<number | null>(initialPrice);
  const [comment, setComment] = useState(record.comment ?? "");
  const [isFree, setIsFree] = useState(record.status === "Выдано");
  const [soldAt, setSoldAt] = useState(() =>
    record.sold_at ? new Date(record.sold_at) : new Date(),
  );
  const [saving, setSaving] = useState(false);

  const autoPrice = Math.round(quantity * unitPrice);
  const price = isFree ? 0 : (manualPrice ?? autoPrice);
  const isValid =
    !!buyer.name &&
    quantity >= 1 &&
    quantity <= record.quantity &&
    (isFree || price > 0);

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Проверьте данные перед сохранением");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        soldTo: buyer.name,
        soldToId: buyer.id,
        price,
        comment,
        quantity,
        isFree,
        soldAt: soldAt.toISOString(),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 py-2">
        <Label htmlFor="sale-buyer">Кому</Label>
        <PlayerCombobox
          id="sale-buyer"
          users={users}
          value={buyer}
          onChange={setBuyer}
        />

        <Label>Дата продажи</Label>
        <DateTimePicker
          hideTime
          value={soldAt}
          onChange={(date) => date && setSoldAt(date)}
        />

        <Label className="mt-2 flex items-center gap-2">
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={isFree}
            onChange={(event) => {
              setIsFree(event.target.checked);
              setManualPrice(null);
            }}
          />
          Выдать бесплатно (0 голды)
        </Label>

        <Label>Цена за 1 шт</Label>
        <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
          {unitPrice.toLocaleString("ru-RU")}
          <Coins className="h-4 w-4" />
        </div>

        <Label htmlFor="sale-quantity">Количество</Label>
        <Input
          id="sale-quantity"
          type="number"
          min={1}
          max={record.quantity}
          value={quantity || ""}
          onChange={(event) => {
            setQuantity(Number(event.target.value) || 0);
            setManualPrice(null);
          }}
        />

        <Label htmlFor="sale-price">Общая цена</Label>
        <Input
          id="sale-price"
          type="number"
          min={0}
          value={price > 0 ? price : ""}
          disabled={isFree}
          onChange={(event) => setManualPrice(Number(event.target.value) || 0)}
          onBlur={() => {
            if (price < 1) setManualPrice(null);
          }}
        />

        <Label htmlFor="sale-comment">Комментарий</Label>
        <Input
          id="sale-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <DialogFooter>
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={saving}
        >
          Сохранить
        </Button>
      </DialogFooter>
    </>
  );
}
