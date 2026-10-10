"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/tw-merge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/ui";
import DimonishMenuItem from "./DimonishMenuItem";
import { ALL_NAV_URLS, NAV_SECTIONS, findActiveUrl } from "./navConfig";
import PromoMenuItem from "./PromoMenuItem";
import type { PromoLink } from "@/shared/config/promoPages";
import AnniversaryBalloons from "@/widgets/AnniversaryBalloons/AnniversaryBalloons";

type Props = {
  isAdmin: boolean;
  locationBadge?: ReactNode;
  locationIcon?: ReactNode;
  promo: PromoLink | null;
};

function AppSidebar({ isAdmin, locationBadge, locationIcon, promo }: Props) {
  const pathname = usePathname();
  const activeUrl = findActiveUrl(pathname, ALL_NAV_URLS);
  const sections = NAV_SECTIONS.filter(
    (section) => !section.adminOnly || isAdmin,
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 pt-4">
        <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col">
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-md px-1"
          >
            <Image
              src="/images/logo.png"
              alt="No Fear"
              width={40}
              height={40}
              className="size-9 shrink-0 object-contain group-data-[collapsible=icon]:size-8"
            />
            <span className="truncate text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
              No Fear
            </span>
          </Link>
          <SidebarTrigger
            className="cursor-pointer text-muted-foreground"
            title="Свернуть или развернуть меню (Ctrl+B)"
            aria-label="Свернуть или развернуть меню"
          />
        </div>
        {locationBadge && (
          <div className="group-data-[collapsible=icon]:hidden">
            {locationBadge}
          </div>
        )}
        {locationIcon && (
          <div className="hidden justify-center group-data-[collapsible=icon]:flex">
            {locationIcon}
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {promo && <PromoMenuItem promo={promo} />}
        {sections.map((section) => (
          <SidebarGroup key={section.title ?? "main"} className="py-1">
            {section.title && (
              <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => {
                  const active = item.url === activeUrl;
                  return (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton
                        asChild
                        isActive={active}
                        tooltip={item.title}
                        className="data-[active=true]:font-semibold"
                      >
                        <Link
                          href={item.url}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon
                            className={cn(
                              "fill-current/20",
                              section.iconClassName,
                            )}
                          />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.isNew && (
                        <SidebarMenuBadge className="rounded-full bg-green-100 px-2 text-2xs font-semibold text-green-800 dark:bg-green-500/15 dark:text-green-300">
                          новое
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
                {section.withDimonish && <DimonishMenuItem />}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <AnniversaryBalloons placement="sidebar" />
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
