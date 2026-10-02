"use client";

import { useState, type ReactNode } from "react";
import { Plus, Search, ShoppingCart, Tag } from "lucide-react";
import {
  getMarketplaceListings,
  type MarketplaceListing,
  type MarketplaceListingType,
} from "@/actions/marketplaceActions";
import type { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { ListingFormDialog } from "./ListingFormDialog";
import { ListingCard } from "./ListingCard";

const COLUMNS: {
  type: MarketplaceListingType;
  title: string;
  icon: ReactNode;
  iconClass: string;
}[] = [
  {
    type: "sell",
    title: "Продам",
    icon: <Tag className="size-4" />,
    iconClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  },
  {
    type: "buy",
    title: "Куплю",
    icon: <ShoppingCart className="size-4" />,
    iconClass:
      "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  },
];

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
  const [search, setSearch] = useState("");
  const [mineOnly, setMineOnly] = useState(false);
  const [tab, setTab] = useState<MarketplaceListingType>("sell");

  const refresh = async () => {
    setListings(await getMarketplaceListings());
  };

  const term = search.trim().toLowerCase();
  const visible = listings.filter(
    (listing) =>
      (!mineOnly || listing.user_id === currentUserId) &&
      (!term ||
        listing.item_name.toLowerCase().includes(term) ||
        (listing.description ?? "").toLowerCase().includes(term)),
  );
  const byType = (type: MarketplaceListingType) =>
    visible.filter((listing) => listing.listing_type === type);
  const hasMine = listings.some((listing) => listing.user_id === currentUserId);

  const createButton = (className: string, label: string) => (
    <ListingFormDialog
      catalogItems={catalogItems}
      onSaved={refresh}
      trigger={
        <Button className={cn("cursor-pointer", className)}>
          <Plus />
          {label}
        </Button>
      }
    />
  );

  const renderColumn = (column: (typeof COLUMNS)[number]) => {
    const items = byType(column.type);
    return (
      <section
        key={column.type}
        aria-label={column.title}
        className="flex min-w-0 flex-col gap-2.5"
      >
        <h2 className="hidden items-center gap-2 text-base font-bold @[48rem]/board:flex">
          <span
            className={cn(
              "flex size-[26px] items-center justify-center rounded-lg",
              column.iconClass,
            )}
          >
            {column.icon}
          </span>
          {column.title}
          <span className="text-[13px] font-medium text-muted-foreground">
            {items.length}
          </span>
        </h2>
        {items.length === 0 ? (
          <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            {term || mineOnly ? "Ничего не найдено" : "Пока нет объявлений"}
          </p>
        ) : (
          items.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              catalogItems={catalogItems}
              canEdit={listing.user_id === currentUserId}
              canDelete={isAdmin || listing.user_id === currentUserId}
              onChanged={refresh}
            />
          ))
        )}
      </section>
    );
  };

  return (
    <div className="@container/board mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Доска объявлений
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Покупка и продажа предметов между участниками гильдии
          </p>
        </div>
        {createButton("hidden sm:inline-flex", "Разместить объявление")}
      </div>

      <div className="flex gap-2">
        <label className="relative flex flex-1 items-center sm:max-w-80">
          <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по объявлениям"
            aria-label="Поиск по объявлениям"
            className="h-11 w-full rounded-xl border bg-background pr-3 pl-9 outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-10 sm:rounded-lg"
          />
        </label>
        {(hasMine || mineOnly) && (
          <button
            type="button"
            aria-pressed={mineOnly}
            onClick={() => setMineOnly((value) => !value)}
            className={cn(
              "h-11 shrink-0 cursor-pointer rounded-xl border px-3 text-[13px] font-medium transition-colors sm:h-10 sm:rounded-full",
              mineOnly
                ? "border-foreground bg-foreground text-background"
                : "bg-background hover:bg-muted",
            )}
          >
            <span className="sm:hidden">Мои</span>
            <span className="hidden sm:inline">Мои объявления</span>
          </button>
        )}
      </div>

      <div
        role="tablist"
        aria-label="Тип объявлений"
        className="grid grid-cols-2 gap-1 rounded-xl bg-muted p-1 @[48rem]/board:hidden"
      >
        {COLUMNS.map((column) => (
          <button
            key={column.type}
            type="button"
            role="tab"
            aria-selected={tab === column.type}
            onClick={() => setTab(column.type)}
            className={cn(
              "h-10 cursor-pointer rounded-lg text-sm font-semibold transition-colors",
              tab === column.type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground",
            )}
          >
            {column.title}{" "}
            <span className="font-medium text-muted-foreground">
              {byType(column.type).length}
            </span>
          </button>
        ))}
      </div>

      <div className="grid items-start gap-5 @[48rem]/board:grid-cols-2">
        {COLUMNS.map((column) => (
          <div
            key={column.type}
            className={cn(
              "min-w-0",
              tab !== column.type && "hidden @[48rem]/board:block",
            )}
          >
            {renderColumn(column)}
          </div>
        ))}
      </div>

      <div className="sticky bottom-24 z-10 -mt-2 flex justify-end sm:hidden">
        {createButton(
          "h-12 rounded-full px-5 text-[15px] shadow-lg shadow-primary/30",
          "Объявление",
        )}
      </div>
    </div>
  );
}
