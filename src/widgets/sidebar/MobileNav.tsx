"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { ALL_NAV_URLS, MOBILE_TABS, findActiveUrl } from "./navConfig";
import { OnlineUsersRow } from "./OnlineUsersWidget";
import { DimonishTile } from "./DimonishMenuItem";
import PromoSheetLink from "./PromoSheetLink";
import type { PromoLink } from "@/shared/config/promoPages";
import {
  TAB_URLS,
  TAB_CLASS,
  PILL_CLASS,
  TILE_CLASS,
  buildSheetSections,
} from "./mobileNavSections";

type Props = {
  isAdmin: boolean;
  promo: PromoLink | null;
};

export default function MobileNav({ isAdmin, promo }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const activeTab = findActiveUrl(pathname, TAB_URLS);
  const activeUrl = findActiveUrl(pathname, ALL_NAV_URLS);
  const moreActive = open || !activeTab;
  const close = () => setOpen(false);

  return (
    <>
      <nav
        aria-label="Основные разделы"
        className="fixed inset-x-0 bottom-0 z-40 flex border-t bg-background/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
      >
        {MOBILE_TABS.map((tab) => {
          const active = !open && tab.url === activeTab;
          return (
            <Link
              key={tab.url}
              href={tab.url}
              onClick={close}
              aria-current={active ? "page" : undefined}
              className={cn(
                TAB_CLASS,
                active
                  ? "font-semibold text-green-700 dark:text-green-400"
                  : "font-medium text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  PILL_CLASS,
                  active && "bg-green-100 dark:bg-green-500/15",
                )}
              >
                <tab.icon className="size-5.5" />
              </span>
              {tab.title}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          className={cn(
            TAB_CLASS,
            moreActive
              ? "font-semibold text-green-700 dark:text-green-400"
              : "font-medium text-muted-foreground",
          )}
        >
          <span
            className={cn(
              PILL_CLASS,
              moreActive && "bg-green-100 dark:bg-green-500/15",
            )}
          >
            <LayoutGrid className="size-5.5" />
          </span>
          Ещё
        </button>
      </nav>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[88dvh] gap-0 overflow-y-auto rounded-t-2xl p-0 outline-none md:hidden"
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Меню</SheetTitle>
            <SheetDescription>Все разделы сайта</SheetDescription>
          </SheetHeader>
          <div className="flex h-10 shrink-0 items-center justify-center">
            <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex flex-col gap-4 px-4 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {promo && <PromoSheetLink promo={promo} onNavigate={close} />}

            {buildSheetSections(isAdmin).map((section) => (
              <section key={section.title} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground">
                  {section.title}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {section.items.map((item) => {
                    const active = item.url === activeUrl;
                    return (
                      <Link
                        key={item.url}
                        href={item.url}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          TILE_CLASS,
                          active &&
                            "border-green-200 bg-green-50 text-green-800 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-300",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "size-5.5",
                            active
                              ? "text-green-600 dark:text-green-400"
                              : "text-muted-foreground",
                          )}
                        />
                        {item.title}
                      </Link>
                    );
                  })}
                  {section.withDimonish && (
                    <DimonishTile className={TILE_CLASS} />
                  )}
                </div>
              </section>
            ))}

            <div className="rounded-xl border">
              <OnlineUsersRow />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
