"use client";
import type { ProfileUser } from "@/actions/getUser";
import type { InventoryItem } from "@/actions/getUserInventory";
import type { ProfileTag } from "@/widgets/profile/profileTypes";
import { useEffect, useState } from "react";
import type { UserSeal } from "@/actions/getUserSeals";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { SocialProvider } from "@/shared/lib/socialProviders";
import calculateGuildTenureBonus from "@/utils/calculateGuildTenureBonus";
import ProfileEditDialog from "./ProfileEditDialog";
import ProfileHeader from "./ProfileHeader";
import ProfileStats from "./ProfileStats";

type UsernameHistory = {
  id: number;
  old_username: string;
  new_username: string;
  changed_at: string;
}[];

const UNLINK_PATCH: Record<SocialProvider, Partial<ProfileUser>> = {
  vk: { vk_id: null, vk_name: null },
  google: { google_id: null },
  mail: { mail_id: null },
};
export default function ProfileInfoClient({
  user,
  setUser,
  tags,
  seals,
  archetype,
  setArchetype,
  inventory,
  onInventoryChange,
  usernameHistory,
  setUsernameHistory,
  canEditProfile,
  canEditNickname,
  canEditGs,
  canAddExtraRole,
  canEditAdminFields,
  canEditVk,
  canEditArchetype,
  canEditInventory,
  isOwnProfile,
  isAdmin,
  activity,
  salary,
  primeStreak,
  killcountStats,
  onOpenSalary,
}: {
  user: ProfileUser;
  setUser: (user: ProfileUser) => void;
  tags: ProfileTag[];
  seals: UserSeal[];
  archetype: UserArchetype;
  setArchetype: (archetype: UserArchetype) => void;
  inventory: InventoryItem[];
  onInventoryChange: () => void;
  usernameHistory: UsernameHistory;
  setUsernameHistory: (history: UsernameHistory) => void;
  canEditProfile: boolean;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditAdminFields: boolean;
  canEditVk: boolean;
  canEditArchetype: boolean;
  canEditInventory: boolean;
  isOwnProfile: boolean;
  isAdmin: boolean;
  activity: {
    aglPercent: number;
    primePercent: number;
    totalPercent: number;
    dkp: number;
    totalPointsAvailable: number;
  };
  salary: number | null;
  primeStreak: PrimeStreak;
  killcountStats: KillcountStats | null;
  onOpenSalary: () => void;
}) {
  const [editOpen, setEditOpen] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [vkName, setVkName] = useState<{ lookup: string; name: string } | null>(
    null,
  );
  const vkLookup: string = user.vk_name || user.vk_id || "";

  useEffect(() => {
    if (!vkLookup) return;
    let cancelled = false;
    fetch(`/api/vk-name?username=${encodeURIComponent(vkLookup)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setVkName({ lookup: vkLookup, name: data.name ?? "" });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [vkLookup]);

  const vkRealName = vkName?.lookup === vkLookup ? vkName.name : "";

  const handleSocialUnlinked = (provider: SocialProvider) => {
    setUser({ ...user, ...UNLINK_PATCH[provider] });
  };

  return (
    <>
      <ProfileHeader
        canEditProfile={canEditProfile}
        onEdit={() => {
          setEditSession((n) => n + 1);
          setEditOpen(true);
        }}
        isOwnProfile={isOwnProfile}
        isAdmin={isAdmin}
        user={user}
        tags={tags}
        usernameHistory={usernameHistory}
        primeStreak={primeStreak}
        archetype={archetype}
        seals={seals}
        vkRealName={vkRealName}
        onSocialUnlinked={handleSocialUnlinked}
      />
      {canEditProfile && (
        <ProfileEditDialog
          key={editSession}
          open={editOpen}
          onOpenChange={setEditOpen}
          user={user}
          archetype={archetype}
          inventory={inventory}
          onInventoryChange={onInventoryChange}
          onSaved={(result) => {
            setUser(result.user);
            setArchetype(result.archetype);
            setUsernameHistory(result.usernameHistory);
          }}
          canEditNickname={canEditNickname}
          canEditGs={canEditGs}
          canAddExtraRole={canAddExtraRole}
          canEditArchetype={canEditArchetype}
          canEditVk={canEditVk}
          canEditJoinedAt={canEditAdminFields}
          canEditInventory={canEditInventory}
          canSkipRequired={canEditAdminFields}
        />
      )}
      <ProfileStats
        activity={activity}
        salary={salary}
        killcountStats={killcountStats}
        tenureBonus={calculateGuildTenureBonus(user.joined_at ?? null)}
        onOpenSalary={onOpenSalary}
      />
    </>
  );
}
