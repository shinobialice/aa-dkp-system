"use client";

import { computeSealBonusSummary, formatStatValue } from "./sealBonusSummary";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";

// Суммарные бонусы от всех выбранных печатей (клик по названию печати в
// SealLevelList — это "до какого уровня", здесь — итог сразу по всем трём).
export default function SealBonusSummaryButton({
  picks,
}: {
  picks: { sealName: string; level: number }[];
}) {
  const totals = computeSealBonusSummary(picks);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          disabled={picks.length === 0}
        >
          Сумма печатей
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Сумма печатей</DialogTitle>
          <DialogDescription>
            Суммарный бонус от всех прокачанных уровней выбранных печатей.
          </DialogDescription>
        </DialogHeader>
        {totals.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Нет прокачанных печатей
          </div>
        ) : (
          <div className="divide-y">
            {totals.map((t) => (
              <div
                key={t.stat}
                className="flex items-center justify-between gap-3 py-1.5 text-sm"
              >
                <span>{t.stat}</span>
                <span className="shrink-0 font-semibold tabular-nums">
                  {formatStatValue(t.value, t.isPercent)}
                </span>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
