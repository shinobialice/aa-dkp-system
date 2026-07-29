"use client";

import { useState } from "react";
import { Input } from "@/shared/ui";
import { updateItemTypePrice } from "@/actions/updateItemTypePrice";

type Props = {
  itemName: string;
  initialPrice: number | null;
  isAdmin: boolean;
};

export function EditablePriceCell({ itemName, initialPrice, isAdmin }: Props) {
  const [price, setPrice] = useState<number | null>(initialPrice);

  const isBundled = itemName.includes("Средоточие") && price === null;

  if (!isAdmin) {
    return <>{isBundled ? "Идут в комплекте" : (price ?? "-")}</>;
  }

  return (
    <Input
      type="number"
      value={price ?? ""}
      placeholder={isBundled ? "Идут в комплекте" : "-"}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onChange={(e) => {
        const value = e.target.value === "" ? null : Number(e.target.value);
        setPrice(value);
        updateItemTypePrice(itemName, value);
      }}
      className="w-28 text-yellow-600 font-semibold"
    />
  );
}
