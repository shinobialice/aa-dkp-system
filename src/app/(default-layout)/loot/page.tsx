import { hasTag } from "@/actions/hasTag";
import TreasuryPage from "@/widgets/Loot/Treasury/TreasuryPage";
import { cookies } from "next/headers";

const LootPage = async () => {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  return <TreasuryPage isAdmin={isAdmin} />;
};

export default LootPage;
