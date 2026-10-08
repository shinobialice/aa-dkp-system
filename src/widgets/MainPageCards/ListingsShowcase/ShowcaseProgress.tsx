import type { MarketplaceListing } from "@/actions/marketplaceActions";

type Props = {
  listings: MarketplaceListing[];
  activeIndex: number;
  onSelect: (index: number) => void;
  onFinish: () => void;
};

export default function ShowcaseProgress({
  listings,
  activeIndex,
  onSelect,
  onFinish,
}: Props) {
  return (
    <div className="flex gap-1 px-3.5 pb-1.5 @2xl:px-7">
      {listings.map((listing, index) => (
        <button
          key={listing.id}
          type="button"
          aria-label={`Показать: ${listing.item_name}`}
          aria-current={index === activeIndex}
          onClick={() => onSelect(index)}
          className="group/segment flex h-3.5 flex-1 cursor-pointer items-center"
        >
          <span className="h-[3px] w-full overflow-hidden rounded-full bg-border group-hover/segment:bg-muted-foreground/40">
            <SegmentFill
              index={index}
              activeIndex={activeIndex}
              onFinish={onFinish}
            />
          </span>
        </button>
      ))}
    </div>
  );
}

function SegmentFill({
  index,
  activeIndex,
  onFinish,
}: {
  index: number;
  activeIndex: number;
  onFinish: () => void;
}) {
  if (index < activeIndex) {
    return <span className="block h-full w-full bg-primary" />;
  }
  if (index === activeIndex) {
    return (
      <span
        className="showcase-progress block h-full w-full bg-primary"
        onAnimationEnd={onFinish}
      />
    );
  }
  return null;
}
