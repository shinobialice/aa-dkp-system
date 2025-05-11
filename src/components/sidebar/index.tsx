"use client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import {
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
  Newspaper,
  Users,
  CalendarDays,
  Trophy,
  Calendar,
  LineChart,
  Settings,
  PiggyBank,
  Gift,
  BadgeDollarSign,
  HandCoins,
} from "lucide-react";
import Link from "next/link";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import useUserTag from "@/src/hooks/useUserTag";
import Image from "next/image";
import { NavUser } from "./NavUser";

export function AppSidebar() {
  const { setTheme } = useTheme();
  const isAdmin = useUserTag("Администратор");

  const menuItems = [
    { title: "Новости", url: "/news", icon: Newspaper },
    { title: "Участники", url: "/members", icon: Users },
    { title: "Активности", url: "/activities", icon: CalendarDays },
    { title: "Расписание", url: "/schedule", icon: Calendar },
    {
      title: "Добыча",
      icon: Trophy,
      items: [
        { title: "Казна", url: "/loot", icon: PiggyBank },
        { title: "Финансы", url: "/loot/finance", icon: HandCoins },
        { title: "Раздача лута", url: "/loot/giveaway", icon: Gift },
        { title: "Покупка лута", url: "/loot/buy", icon: BadgeDollarSign },
      ],
    },
    { title: "Статистика", url: "/stats", icon: LineChart },
    { title: "Настройки", url: "/settings", icon: Settings },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if (item.url === "/settings" && !isAdmin) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarContent>
        <Link
          href="/"
          className="inline-flex items-center gap-3 mb-6 border-b border-border pb-4 pt-4 pl-8"
        >
          <Image
            src="/images/logo.png"
            alt="No Fear"
            width={50}
            height={50}
            className="mb-0"
          />
          <h2 className="text-2xl font-bold text-primary">No Fear</h2>
        </Link>

        <SidebarGroup>
          <SidebarGroupLabel>Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleMenuItems.map((item) => {
                if (item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible
                        defaultOpen
                        className="group/collapsible w-full"
                      >
                        <SidebarMenuButton asChild>
                          <CollapsibleTrigger className="flex items-center w-full gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition cursor-pointer">
                            <item.icon className="h-5 w-5" />
                            <span className="truncate">{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </CollapsibleTrigger>
                        </SidebarMenuButton>
                        <CollapsibleContent className="pl-7 ">
                          <SidebarMenu>
                            {item.items.map((subItem) => (
                              <SidebarMenuItem key={subItem.title}>
                                <SidebarMenuButton asChild>
                                  <Link href={subItem.url}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuItem>
                            ))}
                          </SidebarMenu>
                        </CollapsibleContent>
                      </Collapsible>
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {/* Переключатель темы — теперь сверху */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="cursor-pointer">
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span>Тема</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Светлая
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Тёмная
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Системная
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <NavUser />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
