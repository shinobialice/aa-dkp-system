import { hasTag } from "@/actions/hasTag";
import { getSessionUserId } from "@/actions/getSessionUserId";
import FinanceClient from "@/widgets/Loot/Finance/FinanceClient";
import { cookies } from "next/headers";

export default async function FinancePage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [isAdmin, currentUserId] = await Promise.all([
    hasTag(sessionToken, ["Администратор"]),
    getSessionUserId(),
  ]);
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const msk = new Date(utc + 3 * 60 * 60 * 1000);
  const currentMonth = msk.getMonth() + 1;
  const currentYear = msk.getFullYear();

  return (
    <FinanceClient
      isAdmin={isAdmin}
      currentUserId={currentUserId ?? null}
      currentMonth={currentMonth}
      currentYear={currentYear}
    />
  );
}
