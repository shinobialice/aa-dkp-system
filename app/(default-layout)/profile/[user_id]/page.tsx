import ProfilePageWrapper from "@/src/components/profile/ProfilePageWrapper";
import getUser from "@/src/actions/getUser";
import { getUserTags } from "@/src/actions/userTagsActions";
import getUserInventory from "@/src/actions/getUserInventory";
import getTasks from "@/src/actions/getTasks";
import getUserNotes from "@/src/actions/getUserNotes";

export default async function Page(p: {
  params: Promise<{ user_id: string }>;
}) {
  const { user_id } = await p.params; // 👈 ключевой момент
  const userId = Number(user_id);

  const [user, tags, inventory, tasks, notes] = await Promise.all([
    getUser(userId),
    getUserTags(userId),
    getUserInventory(userId),
    getTasks(userId),
    getUserNotes(userId),
  ]);

  return (
    <ProfilePageWrapper
      user={user}
      tags={tags}
      inventory={inventory}
      tasks={tasks}
      notes={notes}
    />
  );
}
