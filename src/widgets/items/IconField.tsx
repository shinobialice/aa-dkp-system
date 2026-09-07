"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Label } from "@/shared/ui";

// Поле "иконка предмета" для форм на /items — только загрузка файла. Раньше
// был ещё режим "вставить ссылку", но внешние ссылки (на archeagecodex.com и
// т.п.) регулярно оказывались недоступны с проды (хотлинк-защита) — поэтому
// оставили только загрузку на свой хостинг.
export function IconField({
  value,
  onChange,
  uploadAction,
}: {
  value: string;
  onChange: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<string>;
}) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadAction(formData);
      onChange(url);
      toast.success("Иконка загружена");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось загрузить иконку",
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Label>Иконка (40×40)</Label>
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded border bg-muted overflow-hidden">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-10 object-contain" />
          ) : (
            <span className="text-[10px] text-muted-foreground">нет</span>
          )}
        </div>
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            className="cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? "Загрузка..." : "Выбрать файл"}
          </Button>
        </div>
      </div>
    </div>
  );
}
