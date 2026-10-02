import { TabsList, TabsTrigger } from "@/shared/ui";

const SECTIONS = [
  ["equipment", "Экипировка"],
  ["seals", "Печати героя"],
  ["ephe", "Печати Эфе"],
  ["class", "Класс персонажа"],
] as const;

export default function CharacterTabsSwitcher() {
  return (
    <TabsList className="max-w-full justify-start overflow-x-auto [scrollbar-width:none]">
      {SECTIONS.map(([value, label]) => (
        <TabsTrigger
          key={value}
          className="shrink-0 cursor-pointer px-3"
          value={value}
        >
          {label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
