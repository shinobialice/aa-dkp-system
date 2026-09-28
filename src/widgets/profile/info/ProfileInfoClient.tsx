"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import type { UserArchetype } from "@/actions/getUserArchetype";
import SealIcon from "@/widgets/profile/seals/SealIcon";
import {
  getSealGradeLabel,
  getSealGradeForLevel,
} from "@/widgets/profile/seals/sealsData";
import ProfileAdditionalInfo from "./ProfileAdditionalInfo";
import ProfileClasses from "./ProfileClasses";
import ProfileEditDialog from "./ProfileEditDialog";
import ProfileHeader from "./ProfileHeader";
import { Card, CardContent } from "@/shared/ui";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

const formatPoints = (n: number) => Number(n.toFixed(2)).toString();
const currentMonthLabel = new Date().toLocaleDateString("ru-RU", {
  month: "long",
});

export default function ProfileInfoClient({
  user,
  setUser,
  tags: initialTags,
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
  activity,
  salary,
  primeStreak,
  killcountStats,
}: {
  user: any;
  setUser: (user: any) => void;
  tags: any[];
  seals: any[];
  archetype: UserArchetype;
  setArchetype: (archetype: UserArchetype) => void;
  inventory: any[];
  onInventoryChange: () => void;
  usernameHistory: {
    id: number;
    old_username: string;
    new_username: string;
    changed_at: string;
  }[];
  setUsernameHistory: (
    history: {
      id: number;
      old_username: string;
      new_username: string;
      changed_at: string;
    }[],
  ) => void;
  canEditProfile: boolean;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditAdminFields: boolean;
  canEditVk: boolean;
  canEditArchetype: boolean;
  canEditInventory: boolean;
  isOwnProfile: boolean;
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
}) {
  const [tags, setTags] = useState(initialTags);
  const [editOpen, setEditOpen] = useState(false);
  const [editSession, setEditSession] = useState(0);
  const [vkRealName, setVkRealName] = useState("");

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  useEffect(() => {
    const fetchVkName = async () => {
      const lookup = user.vk_name || user.vk_id;
      if (!lookup) {
        setVkRealName("");
        return;
      }

      const res = await fetch(
        `/api/vk-name?username=${encodeURIComponent(lookup)}`,
      );
      const data = await res.json();

      setVkRealName(data.name ?? "");
    };

    fetchVkName();
  }, [user.vk_name, user.vk_id]);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <ProfileHeader
        canEditProfile={canEditProfile}
        onEdit={() => {
          setEditSession((n) => n + 1);
          setEditOpen(true);
        }}
        isOwnProfile={isOwnProfile}
        user={user}
        tags={tags}
        usernameHistory={usernameHistory}
        primeStreak={primeStreak}
        killcountStats={killcountStats}
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
        />
      )}
      <CardContent className="flex flex-wrap gap-x-8 gap-y-4 border-t py-5">
        <ProfileClasses user={user} archetype={archetype} />
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Печати
          </div>
          {seals?.length > 0 ? (
            <div className="flex items-center gap-1.5">
              {seals.map((seal) => (
                <Tooltip key={seal.id}>
                  <TooltipTrigger asChild>
                    <div>
                      <SealIcon
                        grade={getSealGradeForLevel(seal.level)}
                        size={28}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {seal.seal_name} · уровень {seal.level} (
                    {getSealGradeLabel(getSealGradeForLevel(seal.level))})
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          ) : (
            <div className="text-sm font-semibold text-muted-foreground">
              Не выбраны
            </div>
          )}
        </div>
        <ProfileAdditionalInfo user={user} vkRealName={vkRealName} />
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Баллы · {currentMonthLabel}
          </div>
          <div className="text-sm font-semibold">
            {formatPoints(activity.dkp)} /{" "}
            {formatPoints(activity.totalPointsAvailable)}
          </div>
        </div>
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Посещаемость
          </div>
          <div className="text-sm font-semibold">
            {activity.totalPercent.toFixed(2)}%
          </div>
        </div>
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Зарплата · {currentMonthLabel}
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold">
            <Image
              src="https://archeagecodex.com/items/gold.png"
              alt=""
              width={16}
              height={16}
            />
            {salary != null ? salary.toLocaleString("ru-RU") : "—"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
