"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/shared/ui";
import { useSoundNotificationsEnabled } from "@/hooks/useSoundNotificationsEnabled";

export default function SoundNotificationToggle() {
  const { enabled, setSoundEnabled } = useSoundNotificationsEnabled();
  const Icon = enabled ? Volume2 : VolumeX;

  return (
    <label className="mt-1 flex w-fit cursor-pointer items-center gap-2 text-xs text-white/70">
      <Icon className="size-4" />
      Звук перед событиями
      <Switch checked={enabled} onCheckedChange={setSoundEnabled} />
    </label>
  );
}
