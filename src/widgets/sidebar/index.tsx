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
  Info,
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
  Swords,
  UserX,
  Newspaper,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
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
} from "@/shared/ui";
import Image from "next/image";
import { NavUser } from "./NavUser";
import { OnlineUsersWidget } from "./OnlineUsersWidget";
import { FC } from "react";

type Props = { isAdmin: boolean };

const AppSidebar: FC<Props> = ({ isAdmin }) => {
  const { setTheme } = useTheme();
  const router = useRouter();

  const menuItems = [
    { title: "Основная информация", url: "/news", icon: Info },
    { title: "Новости", url: "/game-news", icon: Newspaper },
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
    { title: "Киллкаунт", url: "/kill_counter", icon: Swords },
    { title: "Настройки", url: "/settings", icon: Settings },
    { title: "АФК", url: "/afk", icon: UserX },
  ];

  const visibleMenuItems = menuItems.filter((item) => {
    if ((item.url === "/settings" || item.url === "/afk") && !isAdmin) {
      return false;
    }
    return true;
  });

  return (
    <Sidebar>
      <SidebarContent>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-3 mb-6 border-b border-border pb-4 pt-4 pl-8 cursor-pointer text-left"
        >
          <Image
            src="/images/logo.png"
            alt="No Fear"
            width={50}
            height={50}
            className="mb-0"
          />
          <h2 className="text-2xl font-bold text-primary">No Fear</h2>
        </button>

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
                                <SidebarMenuButton
                                  onClick={() => router.push(subItem.url)}
                                >
                                  <subItem.icon className="h-4 w-4" />
                                  <span>{subItem.title}</span>
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
                    <SidebarMenuButton onClick={() => router.push(item.url)}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
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
          <OnlineUsersWidget />

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
              <DropdownMenuContent side="top" className="w-[250px]">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("light")}
                >
                  Светлая
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("dark")}
                >
                  Тёмная
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setTheme("system")}
                >
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
};

export default AppSidebar;
