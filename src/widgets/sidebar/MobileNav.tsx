"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import useCurrentUser from "@/hooks/useCurrentUser";
import { logout } from "@/actions/logout";
import {
  ALL_NAV_URLS,
  MOBILE_TABS,
  NAV_SECTIONS,
  findActiveUrl,
  type NavItem,
} from "./navConfig";
import { OnlineUsersRow } from "./OnlineUsersWidget";
import { ThemeSheetRow, ViewAsPlayerSheetRow } from "./SidebarControls";
import { DimonishTile } from "./DimonishMenuItem";

const TAB_URLS = MOBILE_TABS.map((tab) => tab.url);

const TAB_CLASS =
  "flex h-16 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 text-[11px]";
const PILL_CLASS = "flex h-7 w-12 items-center justify-center rounded-full transition-colors";
const TILE_CLASS =
  "flex min-h-[76px] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border bg-card px-1.5 py-2 text-center text-xs leading-tight font-medium transition-colors hover:bg-accent";

type SheetSection = { title: string; items: NavItem[]; withDimonish: boolean };

function buildSheetSections(isAdmin: boolean): SheetSection[] {
  const withoutTabs = (items: NavItem[]) =>
    items.filter((item) => !TAB_URLS.includes(item.url));
  const visible = NAV_SECTIONS.filter((section) => !section.adminOnly || isAdmin);
  const guild = visible
    .filter((section) => section.title === null || section.withDimonish)
    .flatMap((section) => withoutTabs(section.items));
  const rest = visible
    .filter((section) => section.title !== null && !section.withDimonish)
    .map((section) => ({
      title: section.title ?? "",
      items: withoutTabs(section.items),
      withDimonish: false,
    }))
    .filter((section) => section.items.length > 0);

  return [{ title: "Гильдия", items: guild, withDimonish: true }, ...rest];
}

export default function MobileNav({
  isAdmin,
  isRealAdmin,
  viewingAsRegular,
}: {
  isAdmin: boolean;
  isRealAdmin: boolean;
  viewingAsRegular: boolean;
}) {
  const pathname = usePathname();
  const user = useCurrentUser();
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
              <span className={cn(PILL_CLASS, active && "bg-green-100 dark:bg-green-500/15")}>
                <tab.icon className="size-[22px]" />
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
          <span className={cn(PILL_CLASS, moreActive && "bg-green-100 dark:bg-green-500/15")}>
            <LayoutGrid className="size-[22px]" />
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
          <div className="flex justify-center pt-2">
            <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
          </div>
          <div className="flex flex-col gap-4 px-4 pt-2 pb-[calc(1.25rem+env(safe-area-inset-bottom))]">
            {user && (
              <div className="flex items-center gap-3 pr-10">
                <Avatar className="size-11">
                  <AvatarImage src={user.avatar} alt="" />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <Link href={`/profile/${user.id}`} onClick={close} className="min-w-0 flex-1">
                  <span className="block truncate font-bold">{user.name}</span>
                  <span className="block text-xs text-muted-foreground">Мой профиль</span>
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  aria-label="Выйти"
                  className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border text-muted-foreground"
                >
                  <LogOut className="size-[18px]" />
                </button>
              </div>
            )}

            {buildSheetSections(isAdmin).map((section) => (
              <section key={section.title} className="space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground">{section.title}</h3>
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
                            "size-[22px]",
                            active ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                          )}
                        />
                        {item.title}
                      </Link>
                    );
                  })}
                  {section.withDimonish && <DimonishTile className={TILE_CLASS} />}
                </div>
              </section>
            ))}

            <div className="divide-y rounded-xl border">
              <OnlineUsersRow />
              {isRealAdmin && <ViewAsPlayerSheetRow initial={viewingAsRegular} />}
              <ThemeSheetRow />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
