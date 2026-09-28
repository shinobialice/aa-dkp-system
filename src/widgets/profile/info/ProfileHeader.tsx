"use client";
import { useRef, useState } from "react";
import { Pencil, Camera, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarImage, AvatarFallback } from "@/shared/ui";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui";
import { uploadAvatar } from "@/actions/uploadAvatar";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import RankProgress from "./RankProgress";
import AnniversaryCelebration from "./AnniversaryCelebration";
import DragonFlyby from "./DragonFlyby";
import PrimeStreakBadge from "./PrimeStreakBadge";

const badgeColors: { [key: string]: string } = {
  Активен: "rgb(47, 158, 98)",
  "Получает зарплату": "rgb(23, 133, 115)",
  Администратор: "rgb(215, 100, 168)",
  Секретутка: "rgb(79, 70, 229)",
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
  tags,
  usernameHistory,
  canEditProfile,
  onEdit,
  isOwnProfile,
  primeStreak,
  killcountStats,
}: {
  user: any;
  tags: { id: number; tag: string }[];
  usernameHistory: {
    id: number;
    old_username: string;
    new_username: string;
    changed_at: string;
  }[];
  canEditProfile: boolean;
  onEdit: () => void;
  isOwnProfile: boolean;
  primeStreak: PrimeStreak;
  killcountStats: KillcountStats | null;
}) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user.avatar_url ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="relative">
      <AnniversaryCelebration joinedAt={user.joined_at ?? null} />
      <DragonFlyby username={user.username} />
      <div className="h-16 w-full bg-gradient-to-br from-primary/25 via-chart-1/15 to-transparent md:h-20" />

      <div className="px-6 pb-4">
        <div className="flex flex-wrap items-start gap-4 lg:flex-nowrap">
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4 -mt-12 md:-mt-14">
              <div className="relative h-24 w-24 shrink-0 md:h-28 md:w-28">
                <Avatar className="h-24 w-24 border-4 border-card shadow-sm md:h-28 md:w-28">
                  <AvatarImage
                    src={
                      avatarUrl ??
                      `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`
                    }
                    alt={user.username}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.username.slice(0, 2)}
                  </AvatarFallback>
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

            <div className="mt-3 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold md:text-2xl">
                  {user.username}
                </h1>
                {usernameHistory.length > 0 && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        aria-label="История ников"
                        className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <ChevronDown className="size-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-72 p-3">
                      <div className="mb-2 text-xs font-medium text-muted-foreground">
                        Этот пользователь также использовал ники:
                      </div>
                      <div className="flex flex-col divide-y">
                        {usernameHistory.map((h) => (
                          <div
                            key={h.id}
                            className="flex items-center justify-between gap-3 py-2"
                          >
                            <span className="truncate text-sm font-medium">
                              {h.old_username}
                            </span>
                            <span className="shrink-0 text-xs text-muted-foreground">
                              {new Date(h.changed_at).toLocaleDateString(
                                "ru-RU",
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
                <PrimeStreakBadge {...primeStreak} />
              </div>

              <div className="flex flex-wrap gap-2">
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
                    style={{
                      backgroundColor: badgeColors["Получает зарплату"],
                    }}
                  >
                    Получает зарплату
                  </Badge>
                )}
                {tags?.map((tag) => (
                  <Badge
                    key={tag.id}
                    className="text-background"
                    style={{
                      backgroundColor:
                        badgeColors[tag.tag] || "rgb(59, 130, 246)",
                    }}
                  >
                    {tag.tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <RankProgress className="shrink-0 lg:-mt-10" stats={killcountStats} />

          {canEditProfile && (
            <Button
              variant="outline"
              size="sm"
              className="ml-auto shrink-0 self-end cursor-pointer"
              onClick={onEdit}
            >
              <Pencil />
              Редактировать
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
