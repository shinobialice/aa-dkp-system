"use client";
import { useRef, useState } from "react";
import { Pencil, Check, Camera } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { CardHeader, CardTitle } from "@/shared/ui";
import { Input } from "@/shared/ui";
import editUser from "@/actions/editUser";
import { uploadAvatar } from "@/actions/uploadAvatar";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";

const badgeColors: { [key: string]: string } = {
  Активен: "rgb(47, 158, 98)",
  "Получает зарплату": "rgb(23, 133, 115)",
  Администратор: "rgb(215, 100, 168)",
  Сноровка: "rgb(90, 54, 165)",
  Крит: "rgb(215, 100, 168)",
  ДВ: "rgb(232, 157, 53)",
  Двурук: "rgb(0, 148, 168)",
  Каст: "rgb(157, 41, 41)",
  Деф: "rgb(40, 111, 180)",
  Модератор: "rgb(58, 76, 92)",
};

export default function ProfileHeader({
  user,
  formData,
  setFormData,
  editMode,
  setEditMode,
  tags,
  setUsernameHistory,
  isAdmin,
  isOwnProfile,
}: {
  user: any;
  formData: any;
  setFormData: (data: any) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  tags: { id: number; tag: string }[];
  setUsernameHistory: (
    history: {
      id: number;
      old_username: string;
      new_username: string;
      changed_at: string;
    }[],
  ) => void;
  isAdmin: boolean;
  isOwnProfile: boolean;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.avatar_url ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      const newAvatarUrl = await uploadAvatar(payload);
      setAvatarUrl(newAvatarUrl);
      toast.success("Аватар обновлён");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось загрузить аватар",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <CardHeader className="flex flex-col items-center">
      <div className="relative flex justify-center w-full">
        <div className="absolute right-0 top-0 flex gap-2">
          {editMode && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-green-500 cursor-pointer"
              onClick={async () => {
                await editUser(
                  user.id,
                  formData.username,
                  formData.class,
                  Number(formData.classGearScore),
                  formData.secondaryClass ?? null,
                  formData.secondaryClassGearScore != null
                    ? Number(formData.secondaryClassGearScore)
                    : null,
                  formData.vkName,
                  formData.joined_at,
                );
                setUsernameHistory(await getUsernameHistory(user.id));
                setEditMode(false);
              }}
            >
              <Check />
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-muted-foreground cursor-pointer"
              onClick={() => setEditMode(!editMode)}
            >
              <Pencil />
            </Button>
          )}
        </div>

        <div className="relative mb-4 h-20 w-20">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={
                avatarUrl ??
                `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`
              }
              alt={user.username}
            />
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>

          {isOwnProfile && (
            <>
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100 disabled:opacity-100 cursor-pointer"
              >
                <Camera className="size-6" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </>
          )}
        </div>
      </div>

      <CardTitle className="text-2xl">
        {(() => {
          if (editMode) {
            return (
              <Input
                className="text-center text-2xl font-bold"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            );
          }
          return formData.username;
        })()}
      </CardTitle>

      <div className="flex gap-2 mt-2">
        {user.active && (
          <Badge
            className="text-background"
            style={{ backgroundColor: badgeColors["Активен"] }}
          >
            Активен
          </Badge>
        )}
        {user.is_eligible_for_salary && (
          <Badge
            className="text-background"
            style={{ backgroundColor: badgeColors["Получает зарплату"] }}
          >
            Получает зарплату
          </Badge>
        )}
        {tags?.map((tag) => (
          <Badge
            key={tag.id}
            className="text-background"
            style={{
              backgroundColor: badgeColors[tag.tag] || "rgb(59, 130, 246)",
            }}
          >
            {tag.tag}
          </Badge>
        ))}
      </div>
    </CardHeader>
  );
}
