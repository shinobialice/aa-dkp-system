"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import SealIcon from "@/widgets/profile/seals/SealIcon";
import { getSealGradeLabel } from "@/widgets/profile/seals/sealsData";
import ProfileAdditionalInfo from "./ProfileAdditionalInfo";
import ProfileClasses from "./ProfileClasses";
import ProfileHeader from "./ProfileHeader";
import { Card, CardContent } from "@/shared/ui";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

const formatPoints = (n: number) => Number(n.toFixed(2)).toString();
const currentMonthLabel = new Date().toLocaleDateString("ru-RU", {
  month: "long",
});

export default function ProfileInfoClient({
  user,
  tags: initialTags,
  seals,
  setUsernameHistory,
  canEditProfile,
  canEditNickname,
  canEditGs,
  canEditAdminFields,
  isOwnProfile,
  activity,
  salary,
  primeStreak,
}: {
  user: any;
  tags: any[];
  seals: any[];
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
  canEditAdminFields: boolean;
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
}) {
  const [tags, setTags] = useState(initialTags);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: user.username,
    class: user.class,
    classGearScore: user.class_gear_score,
    secondaryClass: user.secondary_class,
    secondaryClassGearScore: user.secondary_class_gear_score,
    vkName: user.vk_name,
    vkRealName: "",
    joined_at: user.joined_at ? user.joined_at.slice(0, 10) : "",
  });

  useEffect(() => {
    setTags(initialTags);
  }, [initialTags]);

  useEffect(() => {
    const fetchVkName = async () => {
      if (!formData.vkName) {
        return;
      }

      const res = await fetch(`/api/vk-name?username=${formData.vkName}`);
      const data = await res.json();

      if (data.name) {
        setFormData((prev) => ({ ...prev, vkRealName: data.name }));
      }
    };

    fetchVkName();
  }, [formData.vkName]);

  return (
    <Card className="gap-0 overflow-hidden py-0">
      <ProfileHeader
        canEditProfile={canEditProfile}
        canEditNickname={canEditNickname}
        isOwnProfile={isOwnProfile}
        user={user}
        formData={formData}
        setFormData={setFormData}
        editMode={editMode}
        setEditMode={setEditMode}
        tags={tags}
        setUsernameHistory={setUsernameHistory}
        primeStreak={primeStreak}
      />
      <CardContent className="flex flex-wrap gap-x-8 gap-y-4 border-t py-5">
        <ProfileClasses
          user={user}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          canEditGs={canEditGs}
        />
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
                      <SealIcon grade={seal.grade} size={28} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {seal.seal_name} · {getSealGradeLabel(seal.grade)}
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
        <ProfileAdditionalInfo
          user={user}
          formData={formData}
          setFormData={setFormData}
          editMode={editMode}
          canEditAdminFields={canEditAdminFields}
        />
        <div className="min-w-[140px] space-y-1.5">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Баллы · {currentMonthLabel}
          </div>
          <div className="text-sm font-semibold">
            {formatPoints(activity.dkp)} / {formatPoints(activity.totalPointsAvailable)}
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
