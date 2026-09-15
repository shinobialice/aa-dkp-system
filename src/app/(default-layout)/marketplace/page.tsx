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
    <div className="flex min-h-screen flex-col bg-background text-onBackground p-8">
      <h1 className="text-3xl font-bold mb-2 text-primary">
        Доска объявлений
      </h1>
      <p className="text-sm text-muted-foreground mb-6">
        Продажа предметов между участниками гильдии.
      </p>
      <MarketplaceBoard
        initialListings={listings}
        catalogItems={catalogItems}
        currentUserId={currentUserId}
        isAdmin={isAdmin}
      />
    </div>
  );
}
