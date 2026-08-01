import { hasTag } from "@/actions/hasTag";
import CalendarView from "@/widgets/calendar/CalendarView";
import { cookies } from "next/headers";

const ActivitiesPage = async () => {
  const sessionToken = (await cookies()).get("session_token")?.value ?? ""; // Ensure safe access to value
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const isModerator = await hasTag(sessionToken, ["Модератор"]);
  const isSecretutka = await hasTag(sessionToken, ["Секретутка"]);

  return (
    <>
      <CalendarView
        isAdmin={isAdmin}
        isModerator={isModerator}
        isSecretutka={isSecretutka}
      />
    </>
  );
};

export default ActivitiesPage;
