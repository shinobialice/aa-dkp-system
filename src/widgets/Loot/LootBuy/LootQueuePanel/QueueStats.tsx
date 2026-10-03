import { useState, type ReactNode } from "react";
import Image from "next/image";
import { Pencil, X } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { playersCount, priceLabel, type BuyItem } from "../lootBuyModel";
import PriceEditor from "./PriceEditor";
import { GOLD_ICON_URL } from "@/shared/ui";

type Props = {
  item: BuyItem;
  queueLength: number;
  isAdmin: boolean;
  onPriceSave: (price: number | null) => Promise<void>;
};

export default function QueueStats({
  item,
  queueLength,
  isAdmin,
  onPriceSave,
}: Props) {
  const [editingPrice, setEditingPrice] = useState(false);

  const savePrice = async (price: number | null) => {
    await onPriceSave(price);
    setEditingPrice(false);
  };

  return (
    <div className="mx-4 grid grid-cols-3 divide-x rounded-lg border">
      <Stat
        label="Цена"
        action={
          isAdmin && (
            <button
              type="button"
              aria-label={editingPrice ? "Отменить" : "Изменить цену"}
              onClick={() => setEditingPrice((value) => !value)}
              className="flex cursor-pointer rounded p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {editingPrice ? (
                <X className="size-3.5" />
              ) : (
                <Pencil className="size-3.5" />
              )}
            </button>
          )
        }
      >
        {editingPrice && (
          <PriceEditor
            item={item}
            onSave={savePrice}
            onCancel={() => setEditingPrice(false)}
          />
        )}
        {!editingPrice && <PriceValue item={item} />}
      </Stat>
      <Stat label="На складе">
        <span
          className={cn(
            "text-base font-bold",
            item.stock > 0
              ? "text-green-700 dark:text-green-400"
              : "text-muted-foreground",
          )}
        >
          {item.stock > 0 ? `${item.stock} шт.` : "нет"}
        </span>
      </Stat>
      <Stat label="В очереди">
        <span className="text-base font-bold">
          {queueLength ? playersCount(queueLength) : "пусто"}
        </span>
      </Stat>
    </div>
  );
}

function PriceValue({ item }: { item: BuyItem }) {
  if (item.price === null) {
    return (
      <span className="text-sm font-medium text-muted-foreground">
        {priceLabel(item)}
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-base font-bold tabular-nums">
      <Image src={GOLD_ICON_URL} alt="" width={14} height={14} />
      {priceLabel(item)}
    </span>
  );
}

function Stat({
  label,
  action,
  children,
}: {
  label: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-0.5 px-2.5 py-2">
      <span className="flex items-center justify-between gap-1 text-xs text-muted-foreground">
        {label}
        {action}
      </span>
      {children}
    </div>
  );
}
