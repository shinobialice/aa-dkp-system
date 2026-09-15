"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { MarketplaceListing, getMarketplaceListings } from "@/actions/marketplaceActions";
import { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { Button } from "@/shared/ui";
import { ListingFormDialog } from "./ListingFormDialog";
import { ListingCard } from "./ListingCard";

export function MarketplaceBoard({
  initialListings,
  catalogItems,
  currentUserId,
  isAdmin,
}: {
  initialListings: MarketplaceListing[];
  catalogItems: MarketplaceItemTypeRow[];
  currentUserId: number | null;
  isAdmin: boolean;
}) {
  const [listings, setListings] = useState(initialListings);

  const refresh = async () => {
    setListings(await getMarketplaceListings());
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <ListingFormDialog
          catalogItems={catalogItems}
          onSaved={refresh}
          trigger={
            <Button className="cursor-pointer gap-1.5">
              <Plus className="h-4 w-4" />
              Разместить объявление
            </Button>
          }
        />
      </div>

      {listings.length === 0 ? (
        <div className="text-muted-foreground text-sm">
          Пока нет ни одного объявления.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {listings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              catalogItems={catalogItems}
              canEdit={listing.user_id === currentUserId}
              canDelete={isAdmin || listing.user_id === currentUserId}
              onChanged={refresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
