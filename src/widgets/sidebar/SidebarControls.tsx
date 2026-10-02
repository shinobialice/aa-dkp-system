"use client";

import { useState, useSyncExternalStore, useTransition, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem, Switch } from "@/shared/ui";
import { setViewAsRegular } from "@/actions/viewAsRegular";

const subscribeNoop = () => () => {};

function useDarkTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const isDark = mounted && resolvedTheme === "dark";
  return { isDark, setDark: (dark: boolean) => setTheme(dark ? "dark" : "light") };
}

function useViewAsPlayer(initial: boolean) {
  const router = useRouter();
  const [checked, setChecked] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const toggle = (next: boolean) => {
    setChecked(next);
    startTransition(async () => {
      await setViewAsRegular(next);
      router.refresh();
    });
  };
  return { checked, isPending, toggle };
}

function SidebarSwitchItem({
  icon,
  activeIcon,
  label,
  tooltip,
  checked,
  disabled,
  onChange,
}: {
  icon: ReactNode;
  activeIcon: ReactNode;
  label: string;
  tooltip: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <SidebarMenuItem>
      <div className="flex h-9 items-center gap-2 rounded-md px-2 text-sm group-data-[collapsible=icon]:hidden [&_svg]:size-4 [&_svg]:shrink-0">
        {checked ? activeIcon : icon}
        <span className="flex-1 truncate">{label}</span>
        <Switch
          className="cursor-pointer"
          checked={checked}
          disabled={disabled}
          onCheckedChange={onChange}
          aria-label={label}
        />
      </div>
      <SidebarMenuButton
        className="hidden cursor-pointer group-data-[collapsible=icon]:flex"
        tooltip={tooltip}
        aria-label={tooltip}
        aria-pressed={checked}
        disabled={disabled}
        isActive={checked}
        onClick={() => onChange(!checked)}
      >
        {checked ? activeIcon : icon}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function SheetSwitchRow({
  icon,
  label,
  checked,
  disabled,
  onChange,
}: {
  icon: ReactNode;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 px-4 text-sm [&_svg]:size-[18px] [&_svg]:text-muted-foreground">
      {icon}
      <span className="flex-1">{label}</span>
      <Switch checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </label>
  );
}

export function ThemeSidebarItem() {
  const { isDark, setDark } = useDarkTheme();
  return (
    <SidebarSwitchItem
      icon={<Moon />}
      activeIcon={<Moon />}
      label="Тёмная тема"
      tooltip={isDark ? "Светлая тема" : "Тёмная тема"}
      checked={isDark}
      onChange={setDark}
    />
  );
}

export function ThemeSheetRow() {
  const { isDark, setDark } = useDarkTheme();
  return (
    <SheetSwitchRow
      icon={isDark ? <Moon /> : <Sun />}
      label="Тёмная тема"
      checked={isDark}
      onChange={setDark}
    />
  );
}

export function ViewAsPlayerSidebarItem({ initial }: { initial: boolean }) {
  const { checked, isPending, toggle } = useViewAsPlayer(initial);
  return (
    <SidebarSwitchItem
      icon={<Eye />}
      activeIcon={<EyeOff />}
      label="Глазами игрока"
      tooltip={checked ? "Выйти из режима игрока" : "Глазами игрока"}
      checked={checked}
      disabled={isPending}
      onChange={toggle}
    />
  );
}

export function ViewAsPlayerSheetRow({ initial }: { initial: boolean }) {
  const { checked, isPending, toggle } = useViewAsPlayer(initial);
  return (
    <SheetSwitchRow
      icon={checked ? <EyeOff /> : <Eye />}
      label="Глазами игрока"
      checked={checked}
      disabled={isPending}
      onChange={toggle}
    />
  );
}
