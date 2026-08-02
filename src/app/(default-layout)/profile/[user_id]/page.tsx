import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import getTasks from "@/actions/getTasks";
import getUser from "@/actions/getUser";
import getUserInventory from "@/actions/getUserInventory";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import getUserNotes from "@/actions/getUserNotes";
import { getUserCurrentMonthSalary } from "@/actions/getUserCurrentMonthSalary";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import { getUserTags } from "@/actions/userTagsActions";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";
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

  const [user, tags, inventory, tasks, notes, usernameHistory, salary] =
    await Promise.all([
      getUser(userId),
      getUserTags(userId),
      getUserInventory(userId),
      getTasks(userId),
      getUserNotes(userId),
      getUsernameHistory(userId),
      getUserCurrentMonthSalary(userId),
    ]);

  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const canEditProfile = await hasTag(sessionToken, [
    "Администратор",
    "Секретутка",
  ]);
  const canEditInventory = canEditProfile;
  const sessionUserId = await getSessionUserId();
  const isOwnProfile = sessionUserId === userId;

  return (
    <ProfilePageWrapper
      isAdmin={isAdmin}
      canEditProfile={canEditProfile}
      canEditInventory={canEditInventory}
      isOwnProfile={isOwnProfile}
      user={user}
      tags={tags}
      inventory={inventory}
      tasks={tasks}
      notes={notes}
      usernameHistory={usernameHistory}
      averageGuildGS={averageGuildGS}
      activity={activity}
      salary={salary}
    />
  );
}
