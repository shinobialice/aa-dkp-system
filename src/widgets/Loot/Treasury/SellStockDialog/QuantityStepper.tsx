import { Minus, Plus } from "lucide-react";
import { Button, Input, Label } from "@/shared/ui";
import { quickPicks } from "./sellStockModel";

type Props = {
  value: number;
  max: number;
  onChange: (value: number) => void;
};

export default function QuantityStepper({ value, max, onChange }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="stock-quantity">Количество</Label>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-9 items-center rounded-md border shadow-xs">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full rounded-r-none"
            aria-label="Меньше"
            disabled={value <= 1}
            onClick={() => onChange(value - 1)}
          >
            <Minus />
          </Button>
          <Input
            id="stock-quantity"
            inputMode="numeric"
            value={value}
            onChange={(event) =>
              onChange(Number(event.target.value.replace(/\D/g, "")))
            }
            className="h-full w-14 rounded-none border-y-0 text-center font-semibold shadow-none focus-visible:ring-0"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-full rounded-l-none"
            aria-label="Больше"
            disabled={value >= max}
            onClick={() => onChange(value + 1)}
          >
            <Plus />
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">из {max}</span>
        {max > 1 && (
          <div className="ml-auto flex gap-1.5">
            {quickPicks(max).map((pick) => (
              <Button
                key={pick.value}
                type="button"
                size="sm"
                variant={value === pick.value ? "secondary" : "outline"}
                aria-pressed={value === pick.value}
                onClick={() => onChange(pick.value)}
              >
                {pick.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
