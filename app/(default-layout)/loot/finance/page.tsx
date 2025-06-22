import { hasTag } from "@/src/actions/hasTag";
import FinanceClient from "@/src/components/Loot/Finance/FinanceClient";
import { cookies } from "next/headers";

export default async function FinancePage() {
  const sessionToken = (await cookies()).get("session_token")?.value;
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    <FinanceClient
      isAdmin={isAdmin}
      currentMonth={currentMonth}
      currentYear={currentYear}
    />
  );
}
