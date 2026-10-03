"use client";
import type { ProfileUser } from "@/actions/getUser";
import type { UserSeal } from "@/actions/getUserSeals";
import { Pencil } from "lucide-react";
import { Button } from "@/shared/ui";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { SocialProvider } from "@/shared/lib/socialProviders";
import AnniversaryCelebration from "../AnniversaryCelebration";
import DragonFlyby from "../DragonFlyby";
import PrimeStreakBadge from "../PrimeStreakBadge";
import ProfileClasses from "../ProfileClasses";
import SocialAccountsAdminPanel from "../SocialAccountsAdminPanel";
import { vkProfileUrl } from "@/shared/lib/format";
import TagChip from "./TagChip";
import { formatTenure } from "./tenure";
import ProfileMeta from "./ProfileMeta";
import ProfileAvatar from "./ProfileAvatar";
import UsernameHistory, { type UsernameChange } from "./UsernameHistory";

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
  user: ProfileUser;
  tags: { id: number; tag: string }[];
  usernameHistory: UsernameChange[];
  canEditProfile: boolean;
  onEdit: () => void;
  isOwnProfile: boolean;
  isAdmin: boolean;
  primeStreak: PrimeStreak;
  archetype: UserArchetype;
  seals: UserSeal[];
  vkRealName: string;
  onSocialUnlinked: (provider: SocialProvider) => void;
}) {
  const tenure = formatTenure(user.joined_at ?? null);
  const vkHref = vkProfileUrl(user.vk_name, user.vk_id);
  const tagLabels = [
    ...(user.active ? ["Активен"] : []),
    ...(user.is_eligible_for_salary ? ["Получает зарплату"] : []),
    ...tags.map((tag) => tag.tag),
  ];

  return (
    <section
      aria-label="Игрок"
      className="relative overflow-hidden rounded-xl border bg-card p-4 sm:p-5"
    >
      {user.active && !tags.some((tag) => tag.tag === "АФК") && (
        <AnniversaryCelebration joinedAt={user.joined_at ?? null} />
      )}
      <DragonFlyby username={user.username} />

      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 sm:gap-x-5 sm:gap-y-2">
        <ProfileAvatar
          username={user.username}
          initialUrl={user.avatar_url}
          canUpload={isOwnProfile}
        />

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
            <div className="flex min-w-0 items-center gap-1">
              <h1 className="truncate text-xl leading-tight font-bold tracking-tight sm:text-2xl">
                {user.username}
              </h1>
              <UsernameHistory history={usernameHistory} />
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
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
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
