import { hasTag } from "@/actions/hasTag";
import CalendarView from "@/widgets/calendar/CalendarView";
import { cookies } from "next/headers";

const ActivitiesPage = async () => {
  const sessionToken = (await cookies()).get("session_token")?.value; // Ensure safe access to value
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const isModerator = await hasTag(sessionToken, ["Модератор"]);

  return (
    <>
      <CalendarView isAdmin={isAdmin} isModerator={isModerator} />
    </>
  );
};

export default ActivitiesPage;
