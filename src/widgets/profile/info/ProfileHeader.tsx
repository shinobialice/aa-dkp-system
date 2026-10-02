"use client";
import { useRef, useState } from "react";
import { Camera, ChevronDown, Link2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { differenceInMonths } from "date-fns";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/ui";
import { uploadAvatar } from "@/actions/uploadAvatar";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { SocialProvider } from "@/shared/lib/socialProviders";
import SealIcon from "@/widgets/profile/seals/SealIcon";
import {
  getSealGradeForLevel,
  getSealGradeLabel,
} from "@/widgets/profile/seals/sealsData";
import AnniversaryCelebration from "./AnniversaryCelebration";
import DragonFlyby from "./DragonFlyby";
import PrimeStreakBadge from "./PrimeStreakBadge";
import ProfileClasses from "./ProfileClasses";
import SocialAccountsAdminPanel from "./SocialAccountsAdminPanel";

const TAG_COLORS: Record<string, string> = {
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
const DEFAULT_TAG_COLOR = "rgb(59, 130, 246)";

function TagChip({ label }: { label: string }) {
  const color = TAG_COLORS[label] ?? DEFAULT_TAG_COLOR;
  return (
    <span
      className="inline-flex h-6 items-center rounded-full px-2 text-xs font-semibold whitespace-nowrap"
      style={{
        color,
        backgroundColor: color.replace("rgb(", "rgba(").replace(")", ", 0.12)"),
      }}
    >
      {label}
    </span>
  );
}

function formatTenure(joinedAt: string | null): string | null {
  if (!joinedAt) return null;
  const months = differenceInMonths(new Date(), new Date(joinedAt));
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0 && rest === 0) return "меньше месяца";
  return [years ? `${years} г.` : null, rest ? `${rest} мес.` : null]
    .filter(Boolean)
    .join(" ");
}

function formatJoinedDate(joinedAt: string): string {
  const [year, month, day] = joinedAt.slice(0, 10).split("-");
  return `${day}.${month}.${year}`;
}

export default function ProfileHeader({
  user,
  tags,
  usernameHistory,
  canEditProfile,
  onEdit,
  isOwnProfile,
  isAdmin,
  primeStreak,
  archetype,
  seals,
  vkRealName,
  onSocialUnlinked,
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
  isAdmin: boolean;
  primeStreak: PrimeStreak;
  archetype: UserArchetype;
  seals: any[];
  vkRealName: string;
  onSocialUnlinked: (provider: SocialProvider) => void;
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

  const tenure = formatTenure(user.joined_at ?? null);
  const vkHref = user.vk_name
    ? `https://vk.ru/${user.vk_name}`
    : user.vk_id
      ? `https://vk.com/id${user.vk_id}`
      : null;
  const tagLabels = [
    ...(user.active ? ["Активен"] : []),
    ...(user.is_eligible_for_salary ? ["Получает зарплату"] : []),
    ...(tags ?? []).map((tag) => tag.tag),
  ];

  return (
    <section
      aria-label="Игрок"
      className="relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5"
    >
      {user.active && !tags?.some((t) => t.tag === "АФК") && (
        <AnniversaryCelebration joinedAt={user.joined_at ?? null} />
      )}
      <DragonFlyby username={user.username} />

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-2">
        <div className="relative size-[68px] shrink-0 sm:row-span-2 sm:size-24">
          <Avatar className="size-[68px] sm:size-24">
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
                aria-label="Сменить аватар"
                className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 disabled:opacity-100"
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

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <div className="flex min-w-0 items-center gap-1">
              <h1 className="truncate text-xl leading-tight font-bold tracking-tight sm:text-[26px]">
                {user.username}
              </h1>
              {usernameHistory.length > 0 && (
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      aria-label="История ников"
                      className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
                            {new Date(h.changed_at).toLocaleDateString("ru-RU")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              <PrimeStreakBadge {...primeStreak} />
              {tagLabels.map((label) => (
                <TagChip key={label} label={label} />
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 self-start sm:row-span-2 sm:flex-row sm:items-center">
          {isAdmin && (
            <div className="max-sm:hidden">
              <SocialAccountsAdminPanel
                user={user}
                onUnlinked={onSocialUnlinked}
              />
            </div>
          )}
          {canEditProfile && (
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer max-sm:size-11 max-sm:p-0"
              onClick={onEdit}
              aria-label="Редактировать профиль"
            >
              <Pencil />
              <span className="max-sm:hidden">Редактировать</span>
            </Button>
          )}
        </div>

        <div className="col-span-3 flex flex-col gap-2 sm:col-span-1 sm:col-start-2 sm:row-start-2">
          <ProfileClasses user={user} archetype={archetype} />
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[13px] text-muted-foreground">
            <ProfileMeta
              tenure={tenure}
              joinedAt={user.joined_at ?? null}
              vkHref={vkHref}
              vkRealName={vkRealName}
              seals={seals}
            />
          </div>
          {isAdmin && (
            <div className="sm:hidden">
              <SocialAccountsAdminPanel
                user={user}
                onUnlinked={onSocialUnlinked}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ProfileMeta({
  tenure,
  joinedAt,
  vkHref,
  vkRealName,
  seals,
}: {
  tenure: string | null;
  joinedAt: string | null;
  vkHref: string | null;
  vkRealName: string;
  seals: any[];
}) {
  return (
    <>
      {joinedAt && (
        <span>
          В гильдии{" "}
          <span className="font-semibold text-foreground">{tenure}</span> · с{" "}
          {formatJoinedDate(joinedAt)}
        </span>
      )}
      {vkHref && (
        <a
          href={vkHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-medium text-green-700 hover:underline dark:text-green-400"
        >
          <Link2 className="size-3.5" />
          {vkRealName || "ВКонтакте"}
        </a>
      )}
      {seals?.length > 0 && (
        <span className="inline-flex items-center gap-1.5">
          Печати
          {seals.map((seal) => (
            <Tooltip key={seal.id}>
              <TooltipTrigger asChild>
                <span className="inline-flex">
                  <SealIcon
                    grade={getSealGradeForLevel(seal.level)}
                    size={22}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                {seal.seal_name} · уровень {seal.level} (
                {getSealGradeLabel(getSealGradeForLevel(seal.level))})
              </TooltipContent>
            </Tooltip>
          ))}
        </span>
      )}
    </>
  );
}
