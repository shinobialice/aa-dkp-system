"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import {
  Moon,
  Sun,
  ChevronUp,
  ChevronDown,
  LayoutDashboard,
  Newspaper,
  Users,
  CalendarDays,
  Trophy,
  LineChart,
  Settings,
  User,
  PiggyBank,
  Gift,
  BadgeDollarSign,
  HandCoins,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";

export function AppSidebar() {
  const { setTheme } = useTheme();

  const menuItems = [
    { title: "Панель", url: "/", icon: LayoutDashboard },
    { title: "Новости", url: "/news", icon: Newspaper },
    { title: "Участники", url: "/members", icon: Users },
    { title: "Активности", url: "/activities", icon: CalendarDays },
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

  return (
    <Sidebar>
      <SidebarContent>
        <div className="text-center mb-6 border-b border-border pb-4 pt-4">
          <h2 className="text-2xl font-bold text-primary">No Fear</h2>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Меню</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <Collapsible
                        defaultOpen
                        className="group/collapsible w-full"
                      >
                        <SidebarMenuButton asChild>
                          <CollapsibleTrigger className="flex items-center w-full gap-2 rounded-md p-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition">
                            <item.icon className="h-5 w-5" />
                            <span className="truncate">{item.title}</span>
                            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          </CollapsibleTrigger>
                        </SidebarMenuButton>
                        <CollapsibleContent className="pl-7">
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
                } else {
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
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User className="h-5 w-5" />
                  <span>Профиль</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile/overview">Обзор</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  <span className="text-destructive">Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
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
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
