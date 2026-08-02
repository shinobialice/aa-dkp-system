"use client";

import { Volume2, VolumeX } from "lucide-react";
import { Switch } from "@/shared/ui";
import { useSoundNotificationsEnabled } from "@/hooks/useSoundNotificationsEnabled";

export default function SoundNotificationToggle() {
  const { enabled, setSoundEnabled } = useSoundNotificationsEnabled();

  return (
    <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
      {enabled ? (
        <Volume2 className="size-4" />
      ) : (
        <VolumeX className="size-4" />
      )}
      <Switch checked={enabled} onCheckedChange={setSoundEnabled} />
    </div>
  );
}
