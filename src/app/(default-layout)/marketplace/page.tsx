import { cookies } from "next/headers";
import { getMarketplaceListings } from "@/actions/marketplaceActions";
import { getMarketplaceItemTypes } from "@/actions/marketplaceItemTypeAdmin";
import { getSessionUserId } from "@/actions/getSessionUserId";
import { hasTag } from "@/actions/hasTag";
import { MarketplaceBoard } from "@/widgets/Marketplace/MarketplaceBoard";

export default async function MarketplacePage() {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const [listings, catalogItems, currentUserId, isAdmin] = await Promise.all([
    getMarketplaceListings(),
    getMarketplaceItemTypes(),
    getSessionUserId(),
    hasTag(sessionToken, ["Администратор"]),
  ]);

  return (
    <MarketplaceBoard
      initialListings={listings}
      catalogItems={catalogItems}
      currentUserId={currentUserId}
      isAdmin={isAdmin}
    />
  );
}
