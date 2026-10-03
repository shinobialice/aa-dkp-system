import { Input, Label } from "@/shared/ui";

type Props = {
  unitPrice: number;
  total: number;
  isManual: boolean;
  onUnitPriceChange: (value: number) => void;
  onTotalChange: (value: number) => void;
  onReset: () => void;
};

export default function SalePriceFields({
  unitPrice,
  total,
  isManual,
  onUnitPriceChange,
  onTotalChange,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock-unit">Цена за шт.</Label>
          <Input
            id="stock-unit"
            type="number"
            min={0}
            inputMode="numeric"
            value={unitPrice || ""}
            onChange={(event) => onUnitPriceChange(Number(event.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stock-total">Сумма</Label>
          <Input
            id="stock-total"
            type="number"
            min={0}
            inputMode="numeric"
            value={total || ""}
            className="font-semibold"
            onChange={(event) => onTotalChange(Number(event.target.value))}
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {isManual && (
          <>
            Сумма изменена вручную.{" "}
            <button
              type="button"
              onClick={onReset}
              className="cursor-pointer font-medium text-foreground underline-offset-2 hover:underline"
            >
              Пересчитать
            </button>
          </>
        )}
        {!isManual && "Сумма считается сама — поправьте, если продали дешевле"}
      </p>
    </div>
  );
}
