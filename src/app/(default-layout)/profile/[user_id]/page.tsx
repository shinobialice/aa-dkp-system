import { getAverageGuildGS } from "@/actions/getAverageGuildGS";
import getTasks from "@/actions/getTasks";
import getUser from "@/actions/getUser";
import getUserInventory from "@/actions/getUserInventory";
import { getUserMonthlyAttendance } from "@/actions/getUserMonthlyAttendance";
import getUserNotes from "@/actions/getUserNotes";
import { hasTag } from "@/actions/hasTag";
import { getUserTags } from "@/actions/userTagsActions";
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

  const [user, tags, inventory, tasks, notes] = await Promise.all([
    getUser(userId),
    getUserTags(userId),
    getUserInventory(userId),
    getTasks(userId),
    getUserNotes(userId),
  ]);

  const sessionToken = (await cookies()).get("session_token").value;
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);

  return (
    <ProfilePageWrapper
      isAdmin={isAdmin}
      user={user}
      tags={tags}
      inventory={inventory}
      tasks={tasks}
      notes={notes}
      averageGuildGS={averageGuildGS}
      activity={activity}
    />
  );
}
