import { getWeeklySchedule } from "@/actions/getWeeklySchedule";
import ScheduleClient from "@/widgets/Schedule/ScheduleClient";

export default async function SchedulePage() {
  const schedule = await getWeeklySchedule();
  return <ScheduleClient schedule={schedule} />;
}
