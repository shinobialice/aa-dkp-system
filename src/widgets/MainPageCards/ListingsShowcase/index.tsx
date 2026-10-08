"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight, Megaphone } from "lucide-react";
import type { MarketplaceListing } from "@/actions/marketplaceActions";
import { plural } from "@/shared/lib/format";
import { wrapIndex } from "./showcaseModel";
import ShowcaseProgress from "./ShowcaseProgress";
import ShowcaseQueue from "./ShowcaseQueue";
import ShowcaseSlide from "./ShowcaseSlide";

type Props = {
  listings: MarketplaceListing[];
};

export default function ListingsShowcase({ listings }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const count = listings.length;
  const listing = listings[activeIndex];

  const handleSelect = (index: number) => {
    setActiveIndex(wrapIndex(index, count));
  };

  return (
    <section
      aria-label="Доска объявлений"
      className="showcase @container overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="flex @2xl:h-32">
        <BoardLabel count={count} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Link
            href="/marketplace"
            className="flex items-center justify-between px-3.5 pt-2.5 text-xs font-semibold text-muted-foreground @2xl:hidden"
          >
            <span className="flex items-center gap-1.5">
              <Megaphone className="size-3.5 text-amber-600 dark:text-amber-300" />
              Доска объявлений
            </span>
            <span className="flex items-center gap-0.5 font-medium tabular-nums">
              {activeIndex + 1} / {count}
              <ChevronRight className="size-3.5" />
            </span>
          </Link>
          <ShowcaseSlide key={listing.id} listing={listing} />
          <ShowcaseProgress
            listings={listings}
            activeIndex={activeIndex}
            onSelect={handleSelect}
            onFinish={() => handleSelect(activeIndex + 1)}
          />
        </div>
        {count > 1 && (
          <ShowcaseQueue
            listings={listings}
            activeIndex={activeIndex}
            onSelect={handleSelect}
          />
        )}
      </div>
    </section>
  );
}

function BoardLabel({ count }: { count: number }) {
  return (
    <div className="hidden w-54 shrink-0 flex-col justify-between border-r px-5 py-4.5 @2xl:flex">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8.5 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
          <Megaphone className="size-4.5" />
        </span>
        <div className="min-w-0">
          <p className="text-sm leading-tight font-semibold">
            Доска объявлений
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {count} {plural(count, "объявление", "объявления", "объявлений")}
          </p>
        </div>
      </div>
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline dark:text-green-400"
      >
        Все объявления
        <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}
