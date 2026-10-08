import Link from "next/link";
import type {
  MarketplaceListing,
  MarketplaceListingType,
} from "@/actions/marketplaceActions";
import { avatarSrc } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import ListingPicture from "@/widgets/Marketplace/ListingPicture";
import ListingPrice from "@/widgets/Marketplace/ListingPrice";
import { formatListingDate } from "@/widgets/Marketplace/marketplaceModel";

type Props = {
  listing: MarketplaceListing;
};

const TYPE_BADGES: Record<
  MarketplaceListingType,
  { label: string; className: string }
> = {
  sell: {
    label: "Продам",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  buy: {
    label: "Куплю",
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
};

export default function ShowcaseSlide({ listing }: Props) {
  const badge = TYPE_BADGES[listing.listing_type];

  return (
    <Link
      href="/marketplace"
      className="showcase-slide flex min-w-0 flex-1 items-center gap-3 px-3.5 py-2 @2xl:gap-4 @2xl:px-7"
    >
      <ListingPicture listing={listing} size={56} />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 font-semibold",
              badge.className,
            )}
          >
            {badge.label}
          </span>
          <span className="truncate">
            <span className="@min-[66rem]:hidden">
              {listing.seller_username} ·{" "}
            </span>
            {formatListingDate(listing.created_at)}
          </span>
        </div>
        <div className="flex min-w-0 items-baseline gap-1.5">
          <h3 className="truncate text-base font-semibold @2xl:text-lg">
            {listing.item_name}
          </h3>
          {listing.quantity > 1 && (
            <span className="shrink-0 text-xs font-semibold text-muted-foreground tabular-nums">
              × {listing.quantity.toLocaleString("ru-RU")}
            </span>
          )}
        </div>
        <ListingPrice listing={listing} />
      </div>
      <SellerInfo listing={listing} />
    </Link>
  );
}

function SellerInfo({ listing }: Props) {
  return (
    <div className="hidden max-w-60 shrink-0 flex-col items-end gap-1.5 @min-[66rem]:flex">
      <span className="flex min-w-0 items-center gap-2">
        <Avatar className="size-7 shrink-0">
          <AvatarImage
            src={avatarSrc(listing.seller_username, listing.seller_avatar_url)}
            alt=""
          />
          <AvatarFallback className="text-2xs">
            {listing.seller_username.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <span className="truncate text-sm font-medium">
          {listing.seller_username}
        </span>
      </span>
      {listing.description && (
        <span className="max-w-60 truncate text-sm text-muted-foreground">
          {listing.description}
        </span>
      )}
    </div>
  );
}
