"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/shared/ui";

// Общее поле "иконка предмета" для форм на /items — ровно 2 варианта, как
// просил пользователь: вставить ссылку или загрузить файл. Переключение
// режима никогда не трогает уже введённое значение с ходу — только то, что
// реально сохранится при отправке формы.
export function IconField({
  value,
  onChange,
  uploadAction,
}: {
  value: string;
  onChange: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<string>;
}) {
  const [mode, setMode] = useState<"url" | "upload">("url");
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
        <div className="flex-1 space-y-2">
          <div className="flex gap-1">
            <Button
              type="button"
              size="sm"
              variant={mode === "url" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setMode("url")}
            >
              Ссылка
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "upload" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setMode("upload")}
            >
              Загрузить файл
            </Button>
          </div>

          {mode === "url" ? (
            <Input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://..."
            />
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
