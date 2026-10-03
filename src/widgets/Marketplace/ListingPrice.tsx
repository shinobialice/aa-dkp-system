import Image from "next/image";
import { type MarketplaceListing } from "@/actions/marketplaceActions";
import { GOLD_ICON_URL } from "@/shared/ui";

export default function ListingPrice({
  listing,
}: {
  listing: MarketplaceListing;
}) {
  if (listing.price === null) {
    return (
      <span className="text-base font-semibold text-muted-foreground">
        Договорная
        {listing.currency === "rub" && (
          <span className="text-xs font-medium"> · в рублях</span>
        )}
      </span>
    );
  }
  const amount = listing.price.toLocaleString("ru-RU");
  if (listing.currency === "rub") {
    return <span className="text-lg font-bold tabular-nums">{amount} ₽</span>;
  }
  return (
    <span className="flex items-center gap-1.5 text-lg font-bold tabular-nums">
      <Image src={GOLD_ICON_URL} alt="" width={16} height={16} />
      {amount}
    </span>
  );
}
