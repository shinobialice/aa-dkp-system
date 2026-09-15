"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button, Label } from "@/shared/ui";

export function IconField({
  value,
  onChange,
  uploadAction,
  label = "Иконка (40×40)",
  size = 40,
}: {
  value: string;
  onChange: (url: string) => void;
  uploadAction: (formData: FormData) => Promise<string>;
  label?: string;
  size?: number;
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
      <Label>{label}</Label>
      <div className="flex items-center gap-3">
        <div
          className="flex shrink-0 items-center justify-center rounded border bg-muted overflow-hidden"
          style={{ width: size, height: size }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              className="object-contain"
              style={{ width: size, height: size }}
            />
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
