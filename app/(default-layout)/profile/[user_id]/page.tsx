import ProfileTabs from "@/src/components/profile/ProfileTabs";
import ProfileInfoClient from "@/src/components/profile/info/ProfileInfoClient";
import getTasks from "@/src/actions/getTasks";
import getUserInventory from "@/src/actions/getUserInventory";
import getUser from "@/src/actions/getUser";
import getUserNotes from "@/src/actions/getUserNotes";
import { UserActivityChart } from "@/src/components/profile/activity/UserActivityChart";
import { UserMonthActivity } from "@/src/components/profile/activity/UserMonthActivity";

const ProfilePage = async ({ params }: { params: { user_id: number } }) => {
  const { user_id: userId } = await params;

  const user = await getUser(userId);
  const inventory = await getUserInventory(userId);
  const tasks = await getTasks(userId);
  const notes = await getUserNotes(userId);

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 items-start">
        <UserMonthActivity
          aglPercent={72}
          primePercent={85}
          totalPercent={80}
          dkp={120}
        />

        <div>{user && <UserActivityChart userId={user.id} />}</div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <ProfileInfoClient user={user} />
        <ProfileTabs
          user={user}
          inventory={inventory}
          tasks={tasks}
          // notes={notes}
        />
      </div>
    </div>
  );
};
export default ProfilePage;
