import { cookies } from "next/headers";
import { hasTag } from "@/actions/hasTag";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { getRaidsInRange } from "@/actions/getRaidsInRange";
import AttendanceClient from "@/widgets/Attendance/AttendanceClient";
import {
  moscowTodayKey,
  weekRange,
} from "@/widgets/Attendance/attendanceModel";

export default async function ActivitiesPage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const todayKey = moscowTodayKey();
  const week = weekRange(todayKey);
  const [isAdmin, isModerator, isSecretutka, currentUserId, raids] =
    await Promise.all([
      hasTag(sessionToken, ["Администратор"]),
      hasTag(sessionToken, ["Модератор"]),
      hasTag(sessionToken, ["Секретутка"]),
      getSessionUserId(),
      getRaidsInRange(week.from, week.to),
    ]);

  return (
    <AttendanceClient
      todayKey={todayKey}
      initialRaids={raids}
      currentUserId={currentUserId}
      canEditEvents={isAdmin || isModerator || isSecretutka}
      canEditScreenshots={isAdmin || isSecretutka}
    />
  );
}
