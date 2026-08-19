import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import getTasks from "@/actions/getTasks";
import getUser from "@/actions/getUser";
import getUserInventory from "@/actions/getUserInventory";
import getUserSeals from "@/actions/getUserSeals";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import { getUserPrimeStreak } from "@/actions/getUserPrimeStreak";
import getUserNotes from "@/actions/getUserNotes";
import { getUserCurrentMonthSalary } from "@/actions/getUserCurrentMonthSalary";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import { getUserTags } from "@/actions/userTagsActions";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";
import { getUserSelfEditSettings } from "@/actions/userSelfEditSettings";
import ProfilePageWrapper from "@/widgets/profile/ProfilePageWrapper";
import { cookies } from "next/headers";

export default async function Page(p: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await p.params;
  const userId = Number(user_id);
  const averageGuildGS = await getAverageGuildGS();
  const activity = await getUserMonthlyAttendance(
    userId,
    new Date().getFullYear(),
    new Date().getMonth() + 1,
  );

  const [
    user,
    tags,
    inventory,
    tasks,
    notes,
    usernameHistory,
    salary,
    primeStreak,
    seals,
  ] = await Promise.all([
    getUser(userId),
    getUserTags(userId),
    getUserInventory(userId),
    getTasks(userId),
    getUserNotes(userId),
    getUsernameHistory(userId),
    getUserCurrentMonthSalary(userId),
    getUserPrimeStreak(userId),
    getUserSeals(userId),
  ]);

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const isPrivilegedEditor = await hasTag(sessionToken, [
    "Администратор",
    "Секретутка",
  ]);
  const sessionUserId = await getSessionUserId();
  const isOwnProfile = sessionUserId === userId;

  const selfEditSettings = await getUserSelfEditSettings();
  const canSelfEdit = isOwnProfile && !!user?.active;
  const canEditNickname =
    isPrivilegedEditor || (canSelfEdit && selfEditSettings.nicknameEditEnabled);
  const canEditGs =
    isPrivilegedEditor || (canSelfEdit && selfEditSettings.gsEditEnabled);
  const canEditInventory =
    isPrivilegedEditor ||
    (canSelfEdit && selfEditSettings.inventoryEditEnabled);
  const canEditSeals =
    isPrivilegedEditor || (canSelfEdit && selfEditSettings.sealsEditEnabled);
  const canEditProfile = canEditNickname || canEditGs;

  return (
    <ProfilePageWrapper
      isAdmin={isAdmin}
      canEditProfile={canEditProfile}
      canEditNickname={canEditNickname}
      canEditGs={canEditGs}
      canEditAdminFields={isPrivilegedEditor}
      canEditInventory={canEditInventory}
      canEditSeals={canEditSeals}
      isOwnProfile={isOwnProfile}
      user={user}
      tags={tags}
      inventory={inventory}
      tasks={tasks}
      seals={seals}
      notes={notes}
      usernameHistory={usernameHistory}
      averageGuildGS={averageGuildGS}
      activity={activity}
      salary={salary}
      primeStreak={primeStreak}
    />
  );
}
