"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  reportVoucherAmount,
  type VoucherZone,
} from "@/actions/voucherBoardActions";
import type { GameServer } from "@/shared/config/gameServers";
import {
  VOUCHER_AMOUNTS,
  VOUCHER_RESET_TIME,
} from "@/shared/config/voucherBoard";
import { errorMessage } from "@/shared/lib/errorMessage";
import { cn } from "@/shared/lib/tw-merge";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { amountTone } from "./voucherModel";

type Props = {
  zone: VoucherZone;
  server: GameServer;
  needed: number;
  onReported: () => Promise<void>;
};

export default function VoucherAmountPicker({
  zone,
  server,
  needed,
  onReported,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handlePick = async (amount: number) => {
    setIsSaving(true);
    try {
      await reportVoucherAmount(server, zone.zone, amount);
      await onReported();
      setIsOpen(false);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить значение"));
    } finally {
      setIsSaving(false);
    }
  };

  const title = zone.reportedBy
    ? `Отметка: ${zone.reportedBy}. Нажмите, чтобы исправить`
    : "Нажмите, чтобы указать, сколько просят";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          title={title}
          aria-label={`Сколько просят: ${zone.zone}`}
          className={cn(
            "min-w-6 cursor-pointer rounded border border-dashed px-1 font-semibold transition-colors hover:bg-accent",
            zone.amount === null
              ? "text-muted-foreground"
              : amountTone(zone.amount, needed),
          )}
        >
          {zone.amount ?? "?"}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="flex w-64 flex-col gap-2 text-xs"
      >
        <span className="font-medium">Сколько просят: {zone.zone}?</span>
        <div className="flex gap-1.5">
          {VOUCHER_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              size="sm"
              variant={zone.amount === amount ? "default" : "outline"}
              className="flex-1 cursor-pointer"
              disabled={isSaving}
              onClick={() => handlePick(amount)}
            >
              {amount}
            </Button>
          ))}
        </div>
        <span className="text-muted-foreground">
          Увидят все игроки сервера {server}. Сбросится в {VOUCHER_RESET_TIME}{" "}
          МСК, когда на досках сменятся задания
        </span>
      </PopoverContent>
    </Popover>
  );
}
