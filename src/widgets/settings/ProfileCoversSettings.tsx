"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteProfileCover,
  getProfileCovers,
  uploadProfileCover,
} from "@/actions/profileCovers";
import type { ProfileCoverRow } from "@/shared/lib/dbTypes";
import { useAsyncData } from "@/hooks/useAsyncData";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button } from "@/shared/ui";
import { Loading, SettingsCard } from "./settingsUi";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif";

export default function ProfileCoversSettings() {
  const { data: covers, reload } = useAsyncData(
    "profile-covers",
    getProfileCovers,
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const payload = new FormData();
        payload.append("file", file);
        await uploadProfileCover(payload);
      }
      toast.success("Обложки добавлены");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось загрузить обложку"));
    } finally {
      setIsUploading(false);
      await reload();
    }
  };

  const handleDelete = async (cover: ProfileCoverRow) => {
    const question =
      "Убрать обложку из списка? У тех, кто её выбрал, останется.";
    if (!confirm(question)) return;
    try {
      await deleteProfileCover(cover.id);
      toast.success("Обложка убрана");
      await reload();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось убрать обложку"));
    }
  };

  if (!covers) return <Loading />;

  return (
    <SettingsCard
      title="Обложки"
      hint="широкие картинки, примерно 1600×300"
      action={
        <Button
          variant="outline"
          size="sm"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          <Plus />
          {isUploading ? "Загрузка…" : "Добавить"}
        </Button>
      }
    >
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {covers.map((cover) => (
          <div
            key={cover.id}
            className="relative overflow-hidden rounded-lg border bg-muted"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover.image_url}
              alt=""
              className="h-24 w-full object-cover"
            />
            <Button
              variant="secondary"
              size="icon"
              aria-label="Убрать обложку"
              onClick={() => handleDelete(cover)}
              className="absolute top-2 right-2 size-8 cursor-pointer"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {covers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Обложек пока нет. Игроки всё равно могут загрузить свою картинку.
          </p>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
    </SettingsCard>
  );
}
