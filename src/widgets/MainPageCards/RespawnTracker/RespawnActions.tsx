"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { KillAction } from "@/shared/config/bossRespawn";
import { Button } from "@/shared/ui";
import DateTimePopover from "@/widgets/calendar/DateTimePopover";

type Props = {
  disabled: boolean;
  cooldown: number;
  onRegister: (killTime: Date, action: KillAction) => Promise<void>;
};

export default function RespawnActions({
  disabled,
  cooldown,
  onRegister,
}: Props) {
  const [saving, setSaving] = useState(false);
  const [pickedDate, setPickedDate] = useState<Date | null>(null);
  const isDisabled = disabled || saving;

  const register = async (killTime: Date, action: KillAction) => {
    setSaving(true);
    try {
      await onRegister(killTime, action);
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
    <div className="flex gap-2">
      <Button
        className="flex-1"
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
        <Button variant="outline" className="flex-1" disabled={isDisabled}>
          Указать время
        </Button>
      </DateTimePopover>
    </div>
  );
}
