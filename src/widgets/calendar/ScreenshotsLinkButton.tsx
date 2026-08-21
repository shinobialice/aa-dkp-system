"use client";

import { useEffect, useState } from "react";
import { Pencil, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { Button, Input, Label, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import {
  getScreenshotsLinkSettings,
  updateScreenshotsLinkSettings,
  type ScreenshotsLinkSettings,
} from "@/actions/screenshotsLinkSettings";

type Props = {
  canEdit: boolean;
};

export default function ScreenshotsLinkButton({ canEdit }: Props) {
  const [settings, setSettings] = useState<ScreenshotsLinkSettings | null>(null);
  const [open, setOpen] = useState(false);
  const [draftUrl, setDraftUrl] = useState("");
  const [draftMonth, setDraftMonth] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getScreenshotsLinkSettings().then(setSettings);
  }, []);

  function openEdit() {
    if (!settings) return;
    setDraftUrl(settings.url);
    setDraftMonth(settings.monthLabel);
    setOpen(true);
  }

  async function handleSave() {
    const next = { url: draftUrl.trim(), monthLabel: draftMonth.trim() };
    if (!next.url) return;
    setSaving(true);
    try {
      await updateScreenshotsLinkSettings(next);
      setSettings(next);
      setOpen(false);
      toast.success("Ссылка на скрины обновлена");
    } catch {
      toast.error("Не удалось сохранить ссылку на скрины");
    } finally {
      setSaving(false);
    }
  }

  if (!settings) return null;

  return (
    <div className="flex items-center gap-1">
      <Button asChild variant="outline" className="flex-1 cursor-pointer">
        <a href={settings.url} target="_blank" rel="noopener noreferrer">
          <ImageIcon className="size-4" />
          Скрины сюда
          {settings.monthLabel && ` (${settings.monthLabel})`}
        </a>
      </Button>

      {canEdit && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              size="icon-sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={openEdit}
              title="Изменить ссылку на диск"
            >
              <Pencil className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="screenshots-url">Ссылка на диск</Label>
              <Input
                id="screenshots-url"
                value={draftUrl}
                onChange={(e) => setDraftUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="screenshots-month">Месяц</Label>
              <Input
                id="screenshots-month"
                value={draftMonth}
                onChange={(e) => setDraftMonth(e.target.value)}
                placeholder="Август"
              />
            </div>
            <Button
              className="w-full cursor-pointer"
              onClick={handleSave}
              disabled={saving || !draftUrl.trim()}
            >
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
