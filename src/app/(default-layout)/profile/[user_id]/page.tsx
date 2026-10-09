import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import getUser from "@/actions/getUser";
import getUserInventory from "@/actions/getUserInventory";
import getUserSeals from "@/actions/getUserSeals";
import getUserArchetype from "@/actions/getUserArchetype";
import getUserSkillBuild from "@/actions/getUserSkillBuild";
import getUserCharacterBuffs from "@/actions/getUserCharacterBuffs";
import getUserEquipment from "@/actions/getUserEquipment";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import { getUserPrimeStreak } from "@/actions/getUserPrimeStreak";
import { getUserKillcountStats } from "@/actions/getUserKillcountStats";
import { getProfileStyle } from "@/actions/profileStyle";
import { getUserCurrentMonthSalary } from "@/actions/getUserCurrentMonthSalary";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import { getUserTags } from "@/actions/userTagsActions";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";
import {
  getUserSelfEditSettings,
  type UserSelfEditSettings,
} from "@/actions/userSelfEditSettings";
import ProfilePageWrapper from "@/widgets/profile/ProfilePageWrapper";
import { getMoscowYearMonth } from "@/utils/getMoscowISOString";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

export default async function Page(p: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await p.params;
  const userId = Number(user_id);
  const { year, month } = getMoscowYearMonth(new Date());
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";

  const [
    user,
    tags,
    inventory,
    usernameHistory,
    salary,
    primeStreak,
    seals,
    archetype,
    skillBuild,
    characterBuffs,
    equipment,
    killcountStats,
    profileStyle,
    averageGuildGS,
    activity,
    isAdmin,
    isPrivilegedEditor,
    sessionUserId,
    selfEditSettings,
  ] = await Promise.all([
    getUser(userId),
    getUserTags(userId),
    getUserInventory(userId),
    getUsernameHistory(userId),
    getUserCurrentMonthSalary(userId),
    getUserPrimeStreak(userId),
    getUserSeals(userId),
    getUserArchetype(userId),
    getUserSkillBuild(userId),
    getUserCharacterBuffs(userId),
    getUserEquipment(userId),
    getUserKillcountStats(userId),
    getProfileStyle(userId),
    getAverageGuildGS(),
    getUserMonthlyAttendance(userId, year, month),
    hasTag(sessionToken, ["Администратор"]),
    hasTag(sessionToken, ["Администратор", "Секретутка"]),
    getSessionUserId(),
    getUserSelfEditSettings(),
  ]);

  if (!user) notFound();

  const isOwnProfile = sessionUserId === userId;
  const permissions = resolveEditPermissions(
    isPrivilegedEditor,
    isOwnProfile && user.active,
    selfEditSettings,
  );

  return (
    <ProfilePageWrapper
      {...permissions}
      isAdmin={isAdmin}
      isOwnProfile={isOwnProfile}
      user={user}
      tags={tags}
      inventory={inventory}
      seals={seals}
      archetype={archetype}
      skillBuild={skillBuild}
      characterBuffs={characterBuffs}
      equipment={equipment}
      usernameHistory={usernameHistory}
      averageGuildGS={averageGuildGS}
      activity={activity}
      salary={salary}
      primeStreak={primeStreak}
      killcountStats={killcountStats}
      profileStyle={profileStyle}
    />
  );
}

function resolveEditPermissions(
  isPrivilegedEditor: boolean,
  canSelfEdit: boolean,
  settings: UserSelfEditSettings,
) {
  const allow = (enabled: boolean) =>
    isPrivilegedEditor || (canSelfEdit && enabled);

  const canEditNickname = allow(settings.nicknameEditEnabled);
  const canEditGs = allow(settings.gsEditEnabled);
  const canEditInventory = allow(settings.inventoryEditEnabled);
  const canEditArchetype = allow(settings.archetypeEditEnabled);
  const canAddExtraRole = allow(settings.extraRoleEditEnabled);
  const canEditVk = allow(settings.vkEditEnabled);

  return {
    canEditNickname,
    canEditGs,
    canEditInventory,
    canEditArchetype,
    canAddExtraRole,
    canEditVk,
    canEditSeals: allow(settings.sealsEditEnabled),
    canEditEquipment: allow(settings.equipmentEditEnabled),
    canEditAdminFields: isPrivilegedEditor,
    canEditProfile:
      canEditNickname ||
      canEditGs ||
      canAddExtraRole ||
      canEditArchetype ||
      canEditVk ||
      canEditInventory,
  };
}
