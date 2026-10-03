import { ShoppingCart, Tag } from "lucide-react";
import { type MarketplaceListing } from "@/actions/marketplaceActions";
import { cn } from "@/shared/lib/tw-merge";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui";

export default function ListingPicture({
  listing,
}: {
  listing: MarketplaceListing;
}) {
  if (listing.catalog_item_id) {
    return (
      <LootIcon
        itemName={listing.item_name}
        iconUrl={listing.catalog_icon_url}
        grade={listing.catalog_grade}
        size={48}
      />
    );
  }
  if (listing.image_url) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.item_name}
            className="size-12 shrink-0 rounded-md bg-muted object-cover"
          />
        </TooltipTrigger>
        <TooltipContent side="right" className="p-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={listing.image_url}
            alt={listing.item_name}
            className="max-h-80 max-w-80 rounded object-contain"
          />
        </TooltipContent>
      </Tooltip>
    );
  }
  const isBuy = listing.listing_type === "buy";
  const Icon = isBuy ? ShoppingCart : Tag;
  return (
    <span
      className={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-md",
        isBuy
          ? "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
      )}
    >
      <Icon className="size-5" />
    </span>
  );
}
