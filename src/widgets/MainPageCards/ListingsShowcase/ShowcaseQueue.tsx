import { ChevronLeft, ChevronRight } from "lucide-react";
import type { MarketplaceListing } from "@/actions/marketplaceActions";
import { Button } from "@/shared/ui";
import ListingPicture from "@/widgets/Marketplace/ListingPicture";
import { upcomingIndices } from "./showcaseModel";

type Props = {
  listings: MarketplaceListing[];
  activeIndex: number;
  onSelect: (index: number) => void;
};

export default function ShowcaseQueue({
  listings,
  activeIndex,
  onSelect,
}: Props) {
  const upcoming = upcomingIndices(activeIndex, listings.length);

  return (
    <div className="hidden w-74 shrink-0 flex-col gap-1 border-l py-2.5 pr-3 pl-4 @4xl:flex">
      <div className="flex h-6.5 items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">
          Дальше
        </span>
        <div className="flex items-center gap-0.5">
          <span className="mr-1.5 text-xs text-muted-foreground tabular-nums">
            {activeIndex + 1} / {listings.length}
          </span>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Предыдущее объявление"
            className="size-6.5 cursor-pointer text-muted-foreground"
            onClick={() => onSelect(activeIndex - 1)}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Следующее объявление"
            className="size-6.5 cursor-pointer text-muted-foreground"
            onClick={() => onSelect(activeIndex + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
      {upcoming.map((index) => (
        <button
          key={listings[index].id}
          type="button"
          onClick={() => onSelect(index)}
          className="-ml-2 flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1 text-left transition-colors hover:bg-muted"
        >
          <ListingPicture listing={listings[index]} size={28} />
          <span className="truncate text-sm font-medium">
            {listings[index].item_name}
          </span>
        </button>
      ))}
    </div>
  );
}
