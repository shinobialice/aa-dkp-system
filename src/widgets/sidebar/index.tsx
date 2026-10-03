"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/shared/ui";
import { NavUser } from "./NavUser";
import { OnlineUsersWidget } from "./OnlineUsersWidget";
import DimonishMenuItem from "./DimonishMenuItem";
import { ThemeSidebarItem, ViewAsPlayerSidebarItem } from "./SidebarControls";
import { ALL_NAV_URLS, NAV_SECTIONS, findActiveUrl } from "./navConfig";

type Props = {
  isAdmin: boolean;
  isRealAdmin?: boolean;
  viewingAsRegular?: boolean;
  locationBadge?: ReactNode;
  locationIcon?: ReactNode;
};

function AppSidebar({
  isAdmin,
  isRealAdmin,
  viewingAsRegular,
  locationBadge,
  locationIcon,
}: Props) {
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
                        className="data-[active=true]:font-semibold data-[active=true]:[&>svg]:text-green-600 dark:data-[active=true]:[&>svg]:text-green-400"
                      >
                        <Link
                          href={item.url}
                          aria-current={active ? "page" : undefined}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
                {section.withDimonish && <DimonishMenuItem />}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <OnlineUsersWidget />
          {isRealAdmin && (
            <ViewAsPlayerSidebarItem initial={!!viewingAsRegular} />
          )}
          <ThemeSidebarItem />
        </SidebarMenu>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default AppSidebar;
