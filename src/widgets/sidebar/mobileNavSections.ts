import { MOBILE_TABS, NAV_SECTIONS, type NavItem } from "./navConfig";

export const TAB_URLS = MOBILE_TABS.map((tab) => tab.url);

export const TAB_CLASS =
  "flex h-16 flex-1 cursor-pointer flex-col items-center justify-center gap-0.5 text-2xs";

export const PILL_CLASS =
  "flex h-7 w-12 items-center justify-center rounded-full transition-colors";

export const TILE_CLASS =
  "flex min-h-19 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border bg-card px-1.5 py-2 text-center text-xs leading-tight font-medium transition-colors hover:bg-accent";

type SheetSection = { title: string; items: NavItem[]; withDimonish: boolean };

export function buildSheetSections(isAdmin: boolean): SheetSection[] {
  const withoutTabs = (items: NavItem[]) =>
    items.filter((item) => !TAB_URLS.includes(item.url));
  const visible = NAV_SECTIONS.filter(
    (section) => !section.adminOnly || isAdmin,
  );
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
