"use client";

import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import type { KillAction } from "@/shared/config/bossRespawn";
import { burstSparks } from "@/shared/lib/sparks";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import DateTimePopover from "@/widgets/calendar/DateTimePopover";

const SPARK_COLORS = ["#ffffff", "#bbf7d0", "#4ade80", "#facc15"];
const ACTION_BUTTON =
  "arena-skew h-10 w-full rounded-none font-display tracking-wide uppercase";

type Props = {
  disabled: boolean;
  cooldown: number;
  onRegister: (killTime: Date, action: KillAction) => Promise<boolean>;
  className?: string;
};

export default function RespawnActions({
  disabled,
  cooldown,
  onRegister,
  className,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const killButtonRef = useRef<HTMLButtonElement>(null);
  const isDisabled = disabled || saving;

  const register = async (killTime: Date, action: KillAction) => {
    setSaving(true);
    try {
      const isRegistered = await onRegister(killTime, action);
      if (isRegistered && killButtonRef.current) {
        burstSparks(killButtonRef.current, SPARK_COLORS);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmTime = () => {
    if (!pickedDate) return;
    setPickedDate(null);
    register(pickedDate, "Указано время");
  };

  return (
    <div className={cn("flex gap-2 @xl:flex-col", className)}>
      <Button
        ref={killButtonRef}
        className={cn(ACTION_BUTTON, "flex-1")}
        onClick={() => register(new Date(), "Убит сейчас")}
        disabled={isDisabled}
      >
        {saving && <Loader2 className="animate-spin" />}
        {cooldown > 0 ? `КД ${cooldown}с` : "Убит сейчас"}
      </Button>
      <DateTimePopover
        value={pickedDate}
        onChange={setPickedDate}
        onConfirm={handleConfirmTime}
      >
        <Button
          variant="outline"
          className={cn(ACTION_BUTTON, "flex-1")}
          disabled={isDisabled}
        >
          Указать время
        </Button>
      </DateTimePopover>
    </div>
  );
}
